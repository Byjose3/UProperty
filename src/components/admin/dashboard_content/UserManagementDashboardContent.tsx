"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  getUsersAction as realGetUsersAction,
  suspendUserAction as realSuspendUserAction,
  activateUserAction as realActivateUserAction,
  banUserAction as realBanUserAction,
} from "@/app/actions";
import { useEffect, useState } from "react";
import { Edit, Ban, AlertTriangle, RefreshCw, CheckCircle } from "lucide-react";
import { createClient } from "../../../supabase/client";
import UserEditForm from "@/components/admin/UserEditForm";
import { useToast } from "@/components/ui/use-toast";

interface UserManagementDashboardContentProps {
  searchQuery: string;
  onEditUser?: (user: User) => void;
  // Optional mock functions for storyboards
  getUsersAction?: typeof realGetUsersAction;
  suspendUserAction?: typeof realSuspendUserAction;
  activateUserAction?: typeof realActivateUserAction;
  banUserAction?: typeof realBanUserAction;
}

type User = {
  id: string;
  full_name?: string;
  name?: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
  subscription?: string;
};

export default function UserManagementDashboardContent({
  searchQuery,
  onEditUser,
  getUsersAction = realGetUsersAction,
  suspendUserAction = realSuspendUserAction,
  activateUserAction = realActivateUserAction,
  banUserAction = realBanUserAction,
}: UserManagementDashboardContentProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userToBan, setUserToBan] = useState<User | null>(null);
  const [showBanConfirmation, setShowBanConfirmation] = useState(false);
  const [userToSuspend, setUserToSuspend] = useState<User | null>(null);
  const [showSuspendConfirmation, setShowSuspendConfirmation] = useState(false);
  const [userToActivate, setUserToActivate] = useState<User | null>(null);
  const [showActivateConfirmation, setShowActivateConfirmation] =
    useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const userData = await getUsersAction();
      console.log("Fetched users from Supabase:", userData);
      setUsers(userData || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch of users
  useEffect(() => {
    fetchUsers();
  }, []);

  // Set up real-time subscription to users table
  useEffect(() => {
    const supabase = createClient();

    // Subscribe to changes in the users table
    const subscription = supabase
      .channel("users-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "users" },
        (payload) => {
          console.log("Real-time update received:", payload);

          // Refresh the users list when any change occurs
          fetchUsers();
        },
      )
      .subscribe();

    // Clean up subscription when component unmounts
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const handleStatusChange = async (
    userId: string,
    action: "suspend" | "activate" | "ban",
  ) => {
    try {
      let updatedUser;

      if (action === "suspend") {
        updatedUser = await suspendUserAction(userId);
      } else if (action === "activate") {
        updatedUser = await activateUserAction(userId);
      } else if (action === "ban") {
        updatedUser = await banUserAction(userId);
      }

      if (updatedUser) {
        setUsers(
          users.map((user) =>
            user.id === userId ? { ...user, status: updatedUser.status } : user,
          ),
        );
      }

      // Close the confirmation dialog if it was a ban action
      if (action === "ban") {
        setShowBanConfirmation(false);
        setUserToBan(null);
      } else if (action === "suspend") {
        setShowSuspendConfirmation(false);
        setUserToSuspend(null);
      } else if (action === "activate") {
        setShowActivateConfirmation(false);
        setUserToActivate(null);
      }
    } catch (err) {
      console.error(`Error ${action}ing user:`, err);
      setError(`Failed to ${action} user. Please try again.`);

      // Close the confirmation dialog on error too
      if (action === "ban") {
        setShowBanConfirmation(false);
        setUserToBan(null);
      } else if (action === "suspend") {
        setShowSuspendConfirmation(false);
        setUserToSuspend(null);
      } else if (action === "activate") {
        setShowActivateConfirmation(false);
        setUserToActivate(null);
      }
    }
  };

  const openBanConfirmation = (user: User) => {
    setUserToBan(user);
    setShowBanConfirmation(true);
  };

  const closeBanConfirmation = () => {
    setShowBanConfirmation(false);
    setUserToBan(null);
  };

  const openSuspendConfirmation = (user: User) => {
    setUserToSuspend(user);
    setShowSuspendConfirmation(true);
  };

  const closeSuspendConfirmation = () => {
    setShowSuspendConfirmation(false);
    setUserToSuspend(null);
  };

  const openActivateConfirmation = (user: User) => {
    setUserToActivate(user);
    setShowActivateConfirmation(true);
  };

  const closeActivateConfirmation = () => {
    setShowActivateConfirmation(false);
    setUserToActivate(null);
  };

  const openEditModal = (user: User) => {
    setUserToEdit(user);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setUserToEdit(null);
    setShowEditModal(false);
  };

  const handleSaveUser = (updatedUser: User) => {
    // Update the local state with the updated user data
    setUsers(
      users.map((user) => (user.id === updatedUser.id ? updatedUser : user)),
    );

    // Show success toast notification
    toast({
      title: "Utilizador atualizado",
      description:
        "As informações do utilizador foram atualizadas com sucesso.",
      variant: "default",
      duration: 3000,
      icon: <CheckCircle className="h-4 w-4 text-green-500" />,
    });

    // Close the edit modal
    closeEditModal();

    // Refresh the user list to ensure data consistency
    fetchUsers();
  };

  const filteredUsers = users.filter((user) => {
    if (!searchQuery) return true;
    return (
      (user.full_name?.toLowerCase() || "").includes(
        searchQuery.toLowerCase(),
      ) ||
      (user.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-4">
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-semibold">
              Gestão de Utilizadores
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchUsers}
              className="flex items-center gap-1"
            >
              <RefreshCw className="h-4 w-4" />
              Atualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-700 p-4 rounded-md border border-red-200">
              {error}
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <div className="grid grid-cols-12 bg-gray-100 p-4 font-medium text-sm border-b">
                <div className="col-span-2 px-2">Nome</div>
                <div className="col-span-2 px-2">E-mail</div>
                <div className="col-span-1 px-2">Função</div>
                <div className="col-span-1 px-2">Status</div>
                <div className="col-span-1 px-2">Plano</div>
                <div className="col-span-2 px-2">Data de Registro</div>
                <div className="col-span-3 px-2">Ações</div>
              </div>
              {filteredUsers.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  {searchQuery
                    ? "Nenhum usuário encontrado com os critérios de busca."
                    : loading
                      ? "Carregando utilizadores..."
                      : "Nenhum usuário cadastrado."}
                </div>
              ) : (
                <div className="divide-y">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="grid grid-cols-12 p-4 text-sm hover:bg-gray-50 transition-colors"
                    >
                      <div className="col-span-2 px-2 flex items-center">
                        <span className="truncate font-medium">
                          {user.full_name || user.name || "--"}
                        </span>
                      </div>
                      <div className="col-span-2 px-2 flex items-center">
                        <span className="truncate">{user.email}</span>
                      </div>
                      <div className="col-span-1 px-2 flex items-center">
                        <span className="capitalize truncate">
                          {user.role === "administrador"
                            ? "Administrador"
                            : "Utilizador"}
                        </span>
                      </div>
                      <div className="col-span-1 px-2 flex items-center">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium w-full justify-center ${user.status === "active" ? "bg-green-100 text-green-800" : user.status === "pending" ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800"}`}
                        >
                          {user.status === "active"
                            ? "Ativo"
                            : user.status === "pending"
                              ? "Pendente"
                              : user.status === "suspended"
                                ? "Suspenso"
                                : user.status === "banned"
                                  ? "Banido"
                                  : user.status}
                        </span>
                      </div>
                      <div className="col-span-1 px-2 flex items-center">
                        <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-blue-100 text-blue-800 w-full justify-center">
                          {user.subscription || "Gratuito"}
                        </span>
                      </div>
                      <div className="col-span-2 px-2 flex items-center text-gray-600">
                        {new Date(user.created_at).toLocaleDateString("pt-PT")}
                      </div>
                      <div className="col-span-3 px-2 flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditModal(user)}
                          className="flex items-center gap-1"
                        >
                          <Edit size={16} />
                          Editar
                        </Button>
                        {user.status === "active" ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-amber-50 text-amber-700 hover:bg-amber-100"
                            onClick={() => openSuspendConfirmation(user)}
                          >
                            Suspender
                          </Button>
                        ) : user.status === "pending" ||
                          user.status === "suspended" ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-green-50 text-green-700 hover:bg-green-100"
                            onClick={() => openActivateConfirmation(user)}
                          >
                            Ativar
                          </Button>
                        ) : null}
                        {user.status !== "banned" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-red-50 text-red-700 hover:bg-red-100 flex items-center gap-1"
                            onClick={() => openBanConfirmation(user)}
                          >
                            <Ban size={16} />
                            Banir
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ban Confirmation Dialog */}
      <Dialog open={showBanConfirmation} onOpenChange={setShowBanConfirmation}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Atenção
            </DialogTitle>
            <DialogDescription>
              Tem a certeza que deseja banir o utilizador{" "}
              {userToBan?.full_name || userToBan?.name || userToBan?.email}?
              Esta ação impedirá o acesso do utilizador à plataforma e não pode
              ser revertida.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <Button
              type="button"
              variant="destructive"
              onClick={() =>
                userToBan && handleStatusChange(userToBan.id, "ban")
              }
              className="flex items-center gap-1"
            >
              <Ban size={16} />
              Sim, banir o utilizador
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={closeBanConfirmation}
            >
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Suspend Confirmation Dialog */}
      <Dialog
        open={showSuspendConfirmation}
        onOpenChange={setShowSuspendConfirmation}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Confirmar Suspensão
            </DialogTitle>
            <DialogDescription>
              Tem a certeza que deseja suspender o utilizador{" "}
              {userToSuspend?.full_name ||
                userToSuspend?.name ||
                userToSuspend?.email}
              ? Esta ação impedirá temporariamente o acesso do utilizador à
              plataforma.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <Button
              type="button"
              variant="outline"
              className="bg-amber-50 text-amber-700 hover:bg-amber-100"
              onClick={() =>
                userToSuspend && handleStatusChange(userToSuspend.id, "suspend")
              }
            >
              Sim, suspender o utilizador
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={closeSuspendConfirmation}
            >
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Activate Confirmation Dialog */}
      <Dialog
        open={showActivateConfirmation}
        onOpenChange={setShowActivateConfirmation}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Confirmar Ativação
            </DialogTitle>
            <DialogDescription>
              Tem a certeza que deseja ativar o utilizador{" "}
              {userToActivate?.full_name ||
                userToActivate?.name ||
                userToActivate?.email}
              ? Esta ação permitirá o acesso do utilizador à plataforma.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <Button
              type="button"
              variant="outline"
              className="bg-green-50 text-green-700 hover:bg-green-100"
              onClick={() =>
                userToActivate &&
                handleStatusChange(userToActivate.id, "activate")
              }
            >
              Sim, ativar o utilizador
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={closeActivateConfirmation}
            >
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Utilizador</DialogTitle>
            <DialogDescription>
              Atualize as informações do utilizador abaixo.
            </DialogDescription>
          </DialogHeader>
          {userToEdit && (
            <UserEditForm
              user={userToEdit}
              onSave={handleSaveUser}
              onCancel={closeEditModal}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
