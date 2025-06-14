"use client";

import React, { useState, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Bed,
  Bath,
  Square,
  Bookmark,
  Share2,
  Calendar,
  Check,
  ChevronDown,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { togglePropertyStatus } from "@/services/propertyService";
import { createClient } from "@/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PropertyDetailsProps {
  property: {
    id: number;
    title: string;
    address: string;
    price: string;
    description: string;
    bedrooms: number;
    bathrooms: number;
    area: number;
    status: string;
    statusColor: string;
    image: string;
    images?: string[];
    views: number;
    inquiries: number;
    lastUpdated: string;
    features?: string[];
    agent?: {
      name: string;
      phone: string;
      email: string;
      image: string;
    };
  };
}

const PropertyDetails = ({ property }: PropertyDetailsProps) => {
  const [status, setStatus] = useState(property.status);
  const [statusColor, setStatusColor] = useState(property.statusColor);
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Images carousel navigation functions
  const nextImage = useCallback(() => {
    if (property.images && property.images.length > 0) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === property.images!.length - 1 ? 0 : prevIndex + 1,
      );
      // Reset zoom when changing images
      setIsZoomed(false);
    }
  }, [property.images]);

  const prevImage = useCallback(() => {
    if (property.images && property.images.length > 0) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? property.images!.length - 1 : prevIndex - 1,
      );
      // Reset zoom when changing images
      setIsZoomed(false);
    }
  }, [property.images]);

  // Handle image zoom
  const toggleZoom = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) {
      // Calculate relative position for zoom
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setZoomPosition({ x, y });
    }
    setIsZoomed(!isZoomed);
  };

  // Handle mouse move when zoomed
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isZoomed) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setZoomPosition({ x, y });
    }
  };
  return (
    <div className="space-y-6">
      {/* Property Header */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            {property.title}
          </h1>
          <div className="flex items-center text-gray-500 mt-1">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{property.address}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <>
                    <div
                      className={`h-3 w-3 rounded-full mr-2 ${statusColor}`}
                    ></div>
                  </>
                )}
                {status.charAt(0).toUpperCase() + status.slice(1)}
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="flex items-center cursor-pointer"
                onClick={async () => {
                  if (status === "active") return;
                  setIsUpdating(true);
                  const supabase = createClient();
                  const updatedProperty = await togglePropertyStatus(
                    supabase,
                    property.id,
                    status,
                  );
                  if (updatedProperty) {
                    setStatus("active");
                    setStatusColor("bg-green-100 text-green-800");
                  }
                  setIsUpdating(false);
                }}
              >
                <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                Ativo
                {status === "active" && <Check className="h-4 w-4 ml-2" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center cursor-pointer"
                onClick={async () => {
                  if (status === "draft") return;
                  setIsUpdating(true);
                  const supabase = createClient();
                  const updatedProperty = await togglePropertyStatus(
                    supabase,
                    property.id,
                    status,
                  );
                  if (updatedProperty) {
                    setStatus("draft");
                    setStatusColor("bg-amber-100 text-amber-800");
                  }
                  setIsUpdating(false);
                }}
              >
                <div className="h-3 w-3 rounded-full bg-amber-500 mr-2"></div>
                Rascunho
                {status === "draft" && <Check className="h-4 w-4 ml-2" />}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" className="flex items-center">
            <Bookmark className="h-4 w-4 mr-2" />
            Guardar
          </Button>
          <Button variant="outline" className="flex items-center">
            <Share2 className="h-4 w-4 mr-2" />
            Partilhar
          </Button>
          <Button
            variant="default"
            className="flex items-center bg-orange-500 text-white hover:bg-primary hover:text-primary-foreground"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Agendar Visita
          </Button>
        </div>
      </div>
      {/* Property Images */}
      <div className="relative rounded-xl overflow-hidden">
        {/* Use carousel if multiple images are available, otherwise fallback to single image */}
        {property.images && property.images.length > 0 ? (
          <div className="relative" ref={imageContainerRef}>
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${currentImageIndex * 100}%)`,
                  width: `${property.images.length * 100}%`,
                }}
              >
                {property.images.map((image, index) => (
                  <div
                    key={index}
                    className="w-full flex-shrink-0 cursor-zoom-in"
                    onClick={toggleZoom}
                    onMouseMove={handleMouseMove}
                  >
                    <div
                      className={`relative w-full h-[500px] overflow-hidden transition-all duration-300 ${isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"}`}
                    >
                      <img
                        src={image}
                        alt={`${property.title} - Imagem ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300"
                        style={
                          isZoomed && index === currentImageIndex
                            ? {
                                transform: `scale(1.5)`,
                                transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                              }
                            : {}
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation buttons - only show when not zoomed */}
            {property.images.length > 1 && !isZoomed && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-all duration-200 hover:scale-110"
                  aria-label="Imagem anterior"
                >
                  <ChevronLeft className="h-6 w-6 text-gray-800" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-all duration-200 hover:scale-110"
                  aria-label="Próxima imagem"
                >
                  <ChevronRight className="h-6 w-6 text-gray-800" />
                </button>

                {/* Dots indicator */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                  {property.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentImageIndex(index);
                        setIsZoomed(false);
                      }}
                      className={`h-2 w-2 rounded-full transition-all duration-200 ${currentImageIndex === index ? "bg-white scale-125" : "bg-white/50"}`}
                      aria-label={`Ir para imagem ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Zoom instructions indicator - only show when not zoomed */}
            {!isZoomed && (
              <div className="absolute top-4 left-4 bg-black/50 text-white text-xs px-2 py-1 rounded-md">
                Clique para ampliar
              </div>
            )}
          </div>
        ) : (
          <img
            src={property.image}
            alt={property.title}
            className="w-full h-[500px] object-cover"
          />
        )}
        <div className="absolute top-4 right-4">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
      </div>
      {/* Property Info */}
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detalhes da Propriedade</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-orange-500">
                  {property.price}
                </h2>
                <div className="flex space-x-6 text-gray-600">
                  <div className="flex items-center">
                    <Bed className="h-5 w-5 mr-2" />
                    <span>{property.bedrooms} quartos</span>
                  </div>
                  <div className="flex items-center">
                    <Bath className="h-5 w-5 mr-2" />
                    <span>{property.bathrooms} banheiros</span>
                  </div>
                  <div className="flex items-center">
                    <Square className="h-5 w-5 mr-2" />
                    <span>{property.area}m²</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="font-medium">Descrição</h3>
                <p className="text-gray-600">{property.description}</p>

                {property.features && property.features.length > 0 && (
                  <>
                    <h3 className="font-medium mt-6">Características</h3>
                    <ul className="grid grid-cols-2 gap-2">
                      {property.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <div className="h-2 w-2 rounded-full bg-orange-300 mr-2"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Agent Info */}
        {property.agent && <></>}
      </div>
    </div>
  );
};

export default PropertyDetails;
