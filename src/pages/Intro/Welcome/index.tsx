import { GoogleLogin } from "react-google-login";
import KakaoLogin from "react-kakao-login";
import { useMutation } from "react-query";
import { toast } from "react-toastify";

import Button from "@/components/Button";

import useStore from "@/store/store";

import instance from "@/axios/instance";

import MetaconDeer from "@/assets/icons/metacon-deer.svg";
import ConunLogo from "@/assets/icons/conun-logo.svg";
import GoogleLogo from "@/assets/icons/google-logo.svg";
import KakaoLogo from "@/assets/icons/kakao-logo.svg";

import styles from "./Welcome.module.scss";

function Welcome() {
  const setCurrentStep = useStore((store) => store.setCurrentStep);
  const setUser = useStore((state) => state.setUser);

  const { mutateAsync: checkEmail } = useMutation(async (email: string) => {
    const { data } = await instance.get(`/users/check?email=${email}`);
    return data;
  });

  return (
    <div className={styles.Welcome}>
      <div className={styles.ColumnTop}>
        <MetaconDeer className={styles.Deer} />
        <p className={styles.Title}>Your crypto wallet organizer</p>
      </div>
      <div className={styles.ColumnBottom}>
        <Button
          type="button"
          className={styles.ButtonLow}
          size="large"
          variant="tertiary"
          onClick={() =>
            setCurrentStep({
              current: "walletQuestion",
              previous: "welcome",
            })
          }
        >
          Get started
        </Button>
        <p className={styles.HorizontalLine}>or</p>
        <div className={styles.SocialLogin}>
          <KakaoLogin
            token={process?.env.NEXT_PUBLIC_KAKAO_CLIENT_ID || ""}
            onSuccess={async (response: any) => {
              try {
                setUser({
                  email: response?.profile?.kakao_account?.email,
                  picture:
                    response?.profile?.kakao_account?.profile
                      ?.profile_image_url,
                  name: response?.profile?.kakao_account?.profile?.nickname,
                  token: response?.response?.access_token,
                  oauthType: "kakao",
                });

                const data = await checkEmail(
                  response?.profile?.kakao_account?.email
                );

                if (data.success) {
                  setCurrentStep({
                    current: "alreadyUser",
                    previous: "welcome",
                  });
                } else {
                  setCurrentStep({
                    current: "newUser",
                    previous: "welcome",
                  });
                }
              } catch (error: any) {
                setCurrentStep({
                  current: "newUser",
                  previous: "welcome",
                });
              }
            }}
            onFail={() => {
              toast.error("Sorry, an error happened");
            }}
            onLogout={console.info}
            render={({ onClick }) => {
              return (
                <Button
                  noStyle
                  onClick={() => {
                    onClick();
                  }}
                  className={styles.Kakao}
                >
                  <KakaoLogo />
                </Button>
              );
            }}
          />

          <GoogleLogin
            clientId={process?.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}
            onSuccess={async (response: any) => {
              try {
                setUser({
                  email: response?.profileObj?.email,
                  picture: response?.profileObj?.imageUrl,
                  name: response?.profileObj?.name,
                  token: response?.accessToken,
                  oauthType: "google",
                });

                const data = await checkEmail(response?.profileObj?.email);

                if (data.success) {
                  setCurrentStep({
                    current: "alreadyUser",
                    previous: "welcome",
                  });
                } else {
                  setCurrentStep({
                    current: "newUser",
                    previous: "welcome",
                  });
                }
              } catch (error: any) {
                setCurrentStep({
                  current: "newUser",
                  previous: "welcome",
                });
              }
            }}
            onFailure={() => {
              toast.error("Sorry, an error happened");
            }}
            render={({ onClick }) => {
              return (
                <Button
                  noStyle
                  className={styles.Google}
                  onClick={() => {
                    onClick();
                  }}
                >
                  <GoogleLogo />
                </Button>
              );
            }}
            cookiePolicy="single_host_origin"
          />
        </div>
        <ConunLogo className={styles.Logo} />
      </div>
    </div>
  );
}

export default Welcome;
