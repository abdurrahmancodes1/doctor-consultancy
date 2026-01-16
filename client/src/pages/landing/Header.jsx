import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Bell, Calendar, Stethoscope, User, Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useGetMeQuery } from "@/feature/api/authApi";

// 🔴 Replace with Redux auth later
const isAuthenticated = false;

const Header = ({ showDashboardNav = false }) => {
  const location = useLocation();
  const pathname = location.pathname;

  // const user = {
  //   type: "patient", // or "doctor"
  //   name: "User",
  //   profileImage: "",
  //   email: "abdur@gmail.com",
  // };
  const { data, isLoading } = useGetMeQuery();
  const isAuthenticated = !!data?.user;
  const user = data
    ? {
        type: data.role,
        name: data.user.name,
        profileImage: data.user.profileImage || "",
        email: data.user.email,
      }
    : null;
  const getDashboardNavigation = () => {
    if (!isAuthenticated || !showDashboardNav) return [];

    if (data.role === "patient") {
      return [
        {
          label: "Appointment",
          icon: Calendar,
          to: "/patient/dashboard",
          active: pathname.includes("/patient/dashboard"),
        },
      ];
    }

    if (data.role === "doctor") {
      return [
        {
          label: "Dashboard",
          icon: Calendar,
          to: "/dashboard/doctor",
          active: pathname.includes("/dashboard/doctor"),
        },
        {
          label: "Appointments",
          icon: Calendar,
          to: "/doctor/appointments",
          active: pathname.includes("/doctor/appointments"),
        },
      ];
    }

    return [];
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-white/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-700">
              <Stethoscope className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-blue-700">Medicare +</span>
          </Link>

          {/* Dashboard Nav */}
          {showDashboardNav && (
            <nav className="hidden md:flex items-center space-x-6">
              {getDashboardNavigation().map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center space-x-1 text-sm font-medium ${
                    item.active
                      ? "text-blue-600"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {!isAuthenticated ? (
            <>
              <Link to="/login/patient">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/signup/patient">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Book Consulting
                </Button>
              </Link>
            </>
          ) : (
            <>
              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-600 text-white text-xs flex items-center justify-center">
                  4
                </Badge>
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.profileImage} />
                      <AvatarFallback>
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-gray-500 capitalize">
                        {user.type}
                      </p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.profileImage} />
                        <AvatarFallback>
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="truncate font-medium">{user.name}</p>
                        <p className="text-sm truncate text-gray-500">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild>
                    <Link
                      to={`/${user.type}/profile`}
                      className="flex items-center"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild>
                    <Link
                      to={`/${user.type}/settings`}
                      className="flex items-center"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
