import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate, Link, useParams } from "react-router-dom";
import {
  useGetMeQuery,
  useLoginDoctorMutation,
  useLoginPatientMutation,
  useRegisterDoctorMutation,
  useRegisterPatientMutation,
} from "@/feature/api/authApi";
const AuthForm = ({ type, role }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  // const params = useParams();
  // console.log(params);
  const navigate = useNavigate();
  const [registerDoctor, { isLoading: doctorLoading, error: doctorError }] =
    useRegisterDoctorMutation();

  const [registerPatient, { isLoading: patientLoading, error: patientError }] =
    useRegisterPatientMutation();
  const [loginDoctor, { isLoading: doctorLogin }] = useLoginDoctorMutation();
  const [loginPatient] = useLoginPatientMutation();
  const isLoading = doctorLoading || patientLoading;
  const error = doctorError || patientError;
  const { data } = useGetMeQuery();
  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  // const error = false;
  // const loading = false;
  const isSignup = type === "register";
  const title = isSignup ? "Create a secure account" : "Welcome back";
  const buttonText = isSignup ? "Create account" : "Sign in";
  const altLinkText = isSignup ? "Already a member?" : "Don't have an account?";
  const altLinkAction = isSignup ? "Sign in" : "Sign up";
  const altLinkPath = isSignup ? `/login/${role}` : `/register/${role}`;
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (type === "register" && role === "doctor") {
        await registerDoctor(formData).unwrap();
        navigate("/onboarding/doctor");
      }
      if (type === "register" && role === "patient") {
        await registerPatient(formData).unwrap();
        navigate("/onboarding/patient");
      }
      if (type === "login" && role === "doctor") {
        await loginDoctor(formData).unwrap();
        if (data?.user?.isVerified) {
          navigate("/doctor/dashboard");
        } else {
          navigate("/onboarding/doctor");
        }
      }
      if (type === "login" && role === "patient") {
        await loginPatient(formData).unwrap();
        if (data?.user?.isVerified) {
          navigate("/patient/dashboard");
        } else {
          navigate("/onboarding/patient");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
  // const { data, isError } = useGetMeQuery();
  // console.log(data);
  // console.log(data);
  // useEffect(() => {
  //   // if (isLoadingMe) return false;
  //   if (!data.user.isVerified) {
  //     navigate(`/onboarding/${data.role}`);
  //   }
  // }, [data]);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-blue-900">MediCare+</h1>
      </div>

      <Card className="border-0 shadow-xl">
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
              {error?.data?.message || "Something went wrong"}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignup && (
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="border-0 border-b-2 border-gray-300 rounded-none focus:border-blue-600 focus-visible:ring-0"
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="border-0 border-b-2 border-gray-300 rounded-none focus:border-blue-600 focus-visible:ring-0"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="border-0 border-b-2 border-gray-300 rounded-none focus:border-blue-600 focus-visible:ring-0 pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>

            {isSignup && (
              <div className="flex items-start space-x-2">
                <Checkbox
                  checked={agreeToTerms}
                  onCheckedChange={(v) => setAgreeToTerms(v)}
                />
                <p className="text-sm text-gray-600 leading-5">
                  I confirm that I am over 18 years old and agree to MediCare+'s{" "}
                  <span className="text-blue-600 hover:underline">Terms</span>{" "}
                  and{" "}
                  <span className="text-blue-600 hover:underline">
                    Privacy Policy
                  </span>
                  .
                </p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 rounded-full py-3"
              disabled={isLoading || (isSignup && !agreeToTerms)}
            >
              {isLoading
                ? `${isSignup ? "Creating" : "Signing"} in...`
                : buttonText}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <Separator />
              <div className="absolute inset-0 flex justify-center">
                <span className="bg-white px-2 text-gray-500 text-sm">OR</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <Button
                variant="outline"
                className="w-full rounded-full border-gray-300"
                // onClick={handleGoogleAuth}
              >
                {isSignup ? "Sign up" : "Sign in"} with Google
              </Button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <span className="text-gray-600">{altLinkText} </span>
            <Link
              to={altLinkPath}
              className="text-blue-600 hover:underline font-medium"
            >
              {altLinkAction}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthForm;
