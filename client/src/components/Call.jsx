import React, { useCallback, useEffect, useRef } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
const Call = ({
  appointment,
  appointmentId,
  currentUser,
  onCallEnd,
  joinConsultation,
  // isVideoCall,
}) => {
  const zpRef = useRef(null);
  const containerRef = useRef(null);
  const initializesRef = useRef(false);
  const isComponentMountedRef = useRef(false);
  const memoizedJoinConsultation = useCallback(
    async (appointment) => {
      await joinConsultation(appointmentId);
    },
    [joinConsultation]
  );
  const initializeCall = useCallback(
    async (container) => {
      if (
        initializesRef.current ||
        zpRef.current ||
        !isComponentMountedRef.current
      ) {
        return;
      }
      if (!container) {
        return;
      }
      try {
        initializesRef.current = true;
        const appId = import.meta.env.VITE_REACT_APP_ZEGOCLOUD_APP_ID;
        const serverSecret = import.meta.env.VITE_REACT_ZEGOCLOUD_SERVER_SECRET;
        if (!appId && !serverSecret) {
          throw new Error("Zegocloud credentials is not configured");
        }
        const numericAppId = Number.parseInt(appId);
        if (isNaN(numericAppId)) {
          throw new Error("Invalid zegoclioud");
        }
        try {
          await memoizedJoinConsultation(appointment?._id);
        } catch (error) {
          console.log("failed to update appointment");
        }

        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          numericAppId,
          serverSecret,
          appointment.zegoRoomId,
          currentUser.id,
          currentUser.name
        );

        const zp = ZegoUIKitPrebuilt.create(kitToken);

        zpRef.current = zp;
        const type = (appointment.consultationType || "").toLowerCase();
        const isVideoCall = type.includes("video");

        zp.joinRoom({
          container,
          scenario: {
            mode: ZegoUIKitPrebuilt.OneONoneCall,
          },

          turnOnCameraWhenJoining: isVideoCall,
          showMyMicrophoneToggleButton: true,
          turnOnMicrophoneWhenJoining: true,
          showMyCameraToggleButton: isVideoCall,
          showTextChat: true,
          showUserList: true,
          showRemoveUserButton: true,
          showPinButton: true,
          showAudioVideoSettingsButton: true,
          showTurnOffRemoteCameraButton: true,
          showTurnOffRemoteMicrophoneButton: true,
          maxUsers: 2,
          layout: "Auto",
          showLayoutButton: true,
          onJoinRoom: () => {
            if (isComponentMountedRef.current) {
              console.log("joined");
            }
          },
          onLeaveRoom: () => {
            if (isComponentMountedRef.current) {
              if (zpRef.current) {
                try {
                  zpRef.current.mutePublishStreamAudio(true);
                  zpRef.current.mutePublishStreamVideo(true);
                } catch (error) {
                  console.warn("Error turning off camera/microphone", error);
                }
              }
            }
          },
          onUserJoin: (users) => {
            if (isComponentMountedRef.current) {
              console.log("Users Joined", users);
            }
          },
          onUserLeave: (users) => {
            if (isComponentMountedRef.current) {
              console.log("Users left", users);
            }
          },
          showLeavingView: true,

          onReturnToHomeScreenClicked: () => {
            if (zpRef.current) {
              try {
                zpRef.current.mutePublishStreamAudio(true);
                zpRef.current.mutePublishStreamVideo(true);
              } catch (error) {
                console.warn("Error turning off camera/mircophone", error);
              }
            }
            onCallEnd();
          },
        });
      } catch (error) {
        console.error("Call Initilization failed", error);
        initializesRef.current = false;
        if (isComponentMountedRef.current) {
          zpRef.current = null;
          onCallEnd();
        }
      }
    },
    [
      appointment?._id,
      appointment.zegoRoomId,
      appointment.consutationType,
      currentUser.id,
      currentUser.name,
      memoizedJoinConsultation,
      onCallEnd,
    ]
  );
  useEffect(() => {
    isComponentMountedRef.current = true;
  }, []);

  useEffect(() => {
    if (
      containerRef.current &&
      !initializesRef.current &&
      currentUser.id &&
      currentUser.name &&
      isComponentMountedRef.current
    ) {
      initializeCall(containerRef.current);
    }

    return () => {
      isComponentMountedRef.current = false;
      if (zpRef.current) {
        try {
          zpRef.current.destroy();
        } catch (error) {
          console.warn("clean up", error);
        } finally {
          zpRef.current = null;
        }
      }
    };
  }, [initializeCall, currentUser.id, currentUser.name]);

  // const isVideoCall = appointment.consultationType === "Video Consultation";

  return (
    <div className="h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <div className="bg-white border-b p-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">
            {/* {isVideoCall ? "Video Consultation" : "Voice Consultation"} */}
          </h1>

          <p className="text-sm text-gray-600">
            {currentUser.role === "doctor"
              ? `Patient: ${appointment?.patientId?.name}`
              : `Dr: ${appointment?.doctorId?.name}`}
          </p>
        </div>
      </div>
      <div className="flex-1">
        <div
          ref={containerRef}
          id="appointment-call-container"
          className="w-full h-full bg-gray-900"
          style={{ height: "100%" }}
        ></div>
      </div>
    </div>
  );
};

export default Call;
