import { Calendar, Clock, FileText } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

const EmptyState = ({ tab }) => {
  const emptyStates = {
    upcoming: {
      icon: Clock,
      title: "No Upcoming Appointments",
      description: "You have no upcoming appointments scheduled.",
      showBookButton: true,
    },
    past: {
      icon: FileText,
      title: "No Past Appointments",
      description: "Your completed consultations will appear here.",
      showBookButton: false,
    },
  };

  const state = emptyStates[tab];
  const Icon = state.icon;

  return (
    <Card>
      <CardContent className="p-12 text-center">
        <Icon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {state.title}
        </h3>
        <p className="text-gray-600 mb-6">{state.description}</p>

        {state.showBookButton && (
          <Link to="/doctor-list">
            <Button>
              <Calendar className="w-4 h-4 mr-2" />
              Book Appointment
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
};

export default EmptyState;
