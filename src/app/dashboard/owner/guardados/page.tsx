// Replace this 

                         <Button
                          variant="ghost"
                          size="icon"
                          className="bg-white/80 hover:bg-white rounded-full"
                         

 // with 

                         <Button
                          variant="ghost"
                          size="icon"
                          className="bg-white/80 hover:bg-white rounded-full"
                        >
                          <Heart className="h-4 w-4 text-red-600 fill-red-600" />
                        </Button>
                      </div>
                      <div className="absolute bottom-3 left-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${property.statusColor}`}
                        >
                          {property.status}
                        </span>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-gray-800 mb-1 truncate">
                        {property.title}
                      </h3>
                      <div className="flex items-center text-gray-500 text-sm mb-2">
                        <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span className="truncate">{property.address}</span>
                      </div>
                      <div className="flex justify-between items-center mb-3">
                        <p className="text-lg font-bold text-blue-600">
                          {property.price}
                        </p>
                        <div className="flex space-x-3 text-gray-600 text-sm">
                          <div className="flex items-center">
                            <Bed className="h-3 w-3 mr-1" />
                            <span>{property.bedrooms}</span>
                          </div>
                          <div className="flex items-center">
                            <Bath className="h-3 w-3 mr-1" />
                            <span>{property.bathrooms}</span>
                          </div>
                          <div className="flex items-center">
                            <Square className="h-3 w-3 mr-1" />
                            <span>{property.area}m²</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center"
                        >
                          <Calendar className="h-3 w-3 mr-1" />
                          Agendar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center"
                        >
                          <Share2 className="h-3 w-3 mr-1" />
                          Partilhar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Remover
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </SubscriptionCheck>
  );
}