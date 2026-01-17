import React from "react";
import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Award, Heart, MapPin, Star } from "lucide-react";
import { Badge } from "../ui/badge";

const DoctorProfile = ({ doctor }) => {
  return (
    <Card className="sticky top-8 shadow-xl border-0 max-w-md w-full mx-auto overflow-hidden rounded-2xl bg-white/90 backdrop-blur">
      <CardContent className="p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <Avatar className="w-32 h-32 mx-auto ring-4 ring-blue-100 shadow-sm rounded-full">
            <AvatarImage
              src={doctor?.profileImage}
              alt={doctor?.name}
              className="rounded-full"
            />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold text-4xl">
              {doctor?.name?.charAt(0)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              {doctor?.name}
            </h2>
            <p className="text-blue-600 font-medium">
              {doctor?.specialization}
            </p>
            <p className="text-sm text-gray-500">{doctor?.qualification}</p>
            <p className="text-sm text-gray-500">
              {doctor?.experience} years of experience
            </p>
          </div>

          <div className="flex items-center justify-center space-x-3 mt-4">
            <div className="flex items-center space-x-2 bg-orange-50 px-3 py-1 rounded-full border border-orange-100 shadow-sm">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="w-4 h-4 fill-orange-400 text-orange-400"
                  />
                ))}
              </div>
              <span className="text-sm font-bold text-gray-700">5.0</span>
            </div>
          </div>

          <div className="flex justify-center flex-wrap gap-2 mt-3">
            {doctor?.isVerified && (
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-700 border border-green-200 hover:bg-green-200"
              >
                <Award className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            )}
            {doctor?.category?.map((cat, idx) => (
              <Badge
                key={idx}
                variant="secondary"
                className="bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100"
              >
                {cat}
              </Badge>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-1 text-xs uppercase tracking-wider">
              About
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {doctor.about}
            </p>
          </div>

          {doctor?.hospitalInfo && (
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-1 text-xs uppercase tracking-wider">
                Hospital/Clinic
              </h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p className="font-bold text-gray-900 text-base">
                  {doctor?.hospitalInfo.name}
                </p>
                <p>{doctor?.hospitalInfo.address}</p>
                <div className="flex items-center space-x-1 mt-1 text-gray-500">
                  <MapPin className="w-3 h-3" />
                  <span>{doctor?.hospitalInfo.city}</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 shadow-sm">
            <div>
              <p className="text-xs text-green-700 font-semibold uppercase tracking-wider mb-1">
                Consultation Fee
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl text-green-800 font-bold">
                  ₹{doctor.fees}
                </span>
                <span className="text-xs text-green-600 font-medium">
                  / visit
                </span>
              </div>
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500"></span>
                {doctor.slotDurationMinutes} min session
              </p>
            </div>
            <div className="text-green-600 bg-white p-2 rounded-full shadow-sm border">
              <Heart className="w-6 h-6 fill-current" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DoctorProfile;
