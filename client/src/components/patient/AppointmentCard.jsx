import { Avatar, AvatarImage } from "../ui/avatar";
import { Card, CardContent } from "../ui/card";
import { AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Calendar, FileText, MapPin, Phone, Star, Video } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import PrescriptionViewModel from "../doctor/PrescriptionViewModel";
const AppointmentCard = ({ appointment, isToday, canJoinCall, formatDate }) => (
  <Card className="hover:shadow-lg transition-shadow">
    <CardContent className="p-6">
      <div className="flex flex-col md:flex-row md:items-start md:space-x-6">
        <Avatar className="w-20 h-20 mx-auto md:mx-0">
          <AvatarImage src={appointment.doctorId?.profileImage} />
          <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
            {appointment.doctorId?.name?.charAt(0)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 text-center md:text-left mt-4 md:mt-0">
          <div className="flex flex-col md:flex-row md:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {appointment.doctorId?.name}
              </h3>
              <p className="text-gray-600">
                {appointment.doctorId?.specialization}
              </p>
              <div className="flex items-center justify-center md:justify-start text-sm text-gray-500 gap-1">
                <MapPin className="w-3 h-3" />
                {appointment.doctorId?.hospitalInfo?.name}
              </div>
            </div>

            <div className="mt-2">
              <Badge className="capitalize">{appointment.status}</Badge>
              {isToday(appointment.slotStartIso) && (
                <div className="text-xs text-blue-600 font-semibold mt-1">
                  TODAY
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <Calendar className="w-4 h-4" />
                {formatDate(appointment.slotStartIso)}
              </div>

              <div className="flex items-center justify-center md:justify-start gap-2">
                {appointment.consultationType === "Video Consultation" ? (
                  <Video className="w-4 h-4" />
                ) : (
                  <Phone className="w-4 h-4" />
                )}
                {appointment.consultationType}
              </div>
            </div>

            <div className="text-sm">
              <div className="flex justify-center md:justify-start gap-2">
                <span className="font-semibold">Fee:</span>₹
                {appointment.doctorId?.fees}
              </div>
              {appointment.symptoms && (
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  Symptoms: {appointment.symptoms}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex gap-2">
              {canJoinCall(appointment) && (
                <Link to={`/call/${appointment._id}`}>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    <Video className="w-4 h-4 mr-2" />
                    Join Call
                  </Button>
                </Link>
              )}

              {appointment.status === "Completed" &&
                appointment.prescription && (
                  <PrescriptionViewModel
                    userType="patient"
                    appointment={appointment}
                    trigger={
                      <Button variant="outline" size="sm">
                        <FileText className="w-4 h-4 mr-2" />
                        Prescription
                      </Button>
                    }
                  />
                )}
            </div>

            {appointment.status === "Completed" && (
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default AppointmentCard;
