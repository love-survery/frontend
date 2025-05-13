"use client"; // 꼭 필요! Next.js app 디렉토리에서는!

import { GoogleLogin } from "@react-oauth/google";

interface Props {
  onLoginSuccess: (token: string) => void;
}

export default function GoogleLoginButton({ onLoginSuccess }: Props) {
  return (
    <div>
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          if (credentialResponse.credential) {
            onLoginSuccess(credentialResponse.credential);
          }
        }}
        onError={() => {
          console.log("Google 로그인 실패");
        }}
      />
    </div>
  );
}
