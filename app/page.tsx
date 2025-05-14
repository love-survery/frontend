"use client";
import { GoogleLogin } from "@react-oauth/google";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import axios from "axios";

export default function SurveyPage() {
  const [isAdmin, setIsAdmin] = useState(false);

  const [token, setToken] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(-1);
  const [direction, setDirection] = useState(0);
  const [answers, setAnswers] = useState({
    age: "",
    gender: "",
    appearance: "",
    communication: "",
    shyness: "",
    socialMedia: "",
    blindDates: "",
    interest: "",
    mbti: "",
    datingCount: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<{
    age?: string;
    gender?: string;
    appearance?: string;
    communication?: string;
    shyness?: string;
    socialMedia?: string;
    blindDates?: string;
    interest?: string;
    mbti?: string;
    datingCount?: string;
    agreement?: string;
  }>({});
  const [agreementChecked, setAgreementChecked] = useState(false);

  // Animation controls for shake effect
  const controls = useAnimation();
  const [shouldShake, setShouldShake] = useState(false);

  const totalSteps = 10;

  // Trigger shake animation when validation fails
  useEffect(() => {
    if (shouldShake) {
      controls
        .start({
          x: [0, -10, 10, -10, 10, -5, 5, -2, 2, 0],
          transition: { duration: 0.4, ease: "easeInOut" },
        })
        .then(() => {
          setShouldShake(false);
        });
    }
  }, [shouldShake, controls]);

  const updateAnswer = (field: string, value: string) => {
    setAnswers({ ...answers, [field]: value });

    // Clear error for this field when it's filled
    if (value) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    // Additional validation for age field
    if (field === "age") {
      const ageNum = Number.parseInt(value);
      if (!value) {
        setErrors((prev) => ({ ...prev, age: undefined }));
      } else if (isNaN(ageNum) || ageNum < 1 || !Number.isInteger(ageNum)) {
        setErrors((prev) => ({
          ...prev,
          age: "나이는 1세 이상이어야 합니다.",
        }));
      } else {
        setErrors((prev) => ({ ...prev, age: undefined }));
      }
    }
  };

  const startSurvey = () => {
    if (!agreementChecked) {
      setErrors((prev) => ({ ...prev, agreement: "동의가 필요합니다." }));
      setShouldShake(true);
      return;
    }

    setErrors((prev) => ({ ...prev, agreement: undefined }));
    setDirection(1);
    setCurrentStep(1);
  };

  const nextStep = () => {
    // Validate current step before proceeding
    let hasError = false;

    switch (currentStep) {
      case 1: // Age
        const ageNum = Number.parseInt(answers.age);
        if (
          !answers.age ||
          isNaN(ageNum) ||
          ageNum < 1 ||
          !Number.isInteger(ageNum)
        ) {
          setErrors((prev) => ({
            ...prev,
            age: "나이는 1세 이상이어야 합니다.",
          }));
          hasError = true;
        }
        break;
      case 2: // Gender
        if (!answers.gender) {
          setErrors((prev) => ({ ...prev, gender: "이 문항은 필수입니다." }));
          hasError = true;
        }
        break;
      case 3: // Appearance
        if (!answers.appearance) {
          setErrors((prev) => ({
            ...prev,
            appearance: "이 문항은 필수입니다.",
          }));
          hasError = true;
        }
        break;
      case 4: // Communication
        if (!answers.communication) {
          setErrors((prev) => ({
            ...prev,
            communication: "이 문항은 필수입니다.",
          }));
          hasError = true;
        }
        break;
      case 5: // Shyness
        if (!answers.shyness) {
          setErrors((prev) => ({ ...prev, shyness: "이 문항은 필수입니다." }));
          hasError = true;
        }
        break;
      case 6: // Social Media
        if (!answers.socialMedia) {
          setErrors((prev) => ({
            ...prev,
            socialMedia: "이 문항은 필수입니다.",
          }));
          hasError = true;
        }
        break;
      case 7: // Blind Dates
        if (!answers.blindDates) {
          setErrors((prev) => ({
            ...prev,
            blindDates: "이 문항은 필수입니다.",
          }));
          hasError = true;
        }
        break;
      case 8: // Interest
        if (!answers.interest) {
          setErrors((prev) => ({ ...prev, interest: "이 문항은 필수입니다." }));
          hasError = true;
        }
        break;
      case 9: // MBTI
        if (!answers.mbti) {
          setErrors((prev) => ({ ...prev, mbti: "이 문항은 필수입니다." }));
          hasError = true;
        }
        break;
      case 10: // Dating Count
        if (!answers.datingCount) {
          setErrors((prev) => ({
            ...prev,
            datingCount: "이 문항은 필수입니다.",
          }));
          hasError = true;
        }
        break;
    }

    if (hasError) {
      // Trigger shake animation
      setShouldShake(true);
      return;
    }

    if (currentStep < totalSteps + 1) {
      setDirection(1);
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    // Here you would typically send the data to your backend
    //console.log("Survey submitted:", answers);
    //setSubmitted(true);
    if (!token) {
      alert("먼저 Google로 로그인 해주세요!");
      return;
    }

    try {
      const res = await axios.post(
        "https://love-survery-api.injun.dev/submit",
        {
          token,
          answers,
        }
      );

      console.log("서버 응답:", res.data);
      setSubmitted(true); // 제출 완료 상태로 변경
    } catch (error: any) {
      if (error.response?.status === 409) {
        alert("이미 설문을 제출하셨습니다!");
      } else {
        alert("제출 실패");
      }
    }
  };

  const resetSurvey = () => {
    setAnswers({
      age: "",
      gender: "",
      appearance: "",
      communication: "",
      shyness: "",
      socialMedia: "",
      blindDates: "",
      interest: "",
      mbti: "",
      datingCount: "",
    });
    setCurrentStep(-1);
    setSubmitted(false);
    setAgreementChecked(false);
  };

  // Enhanced slide animation variants with improved transitions
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2, ease: "easeOut" },
        scale: { duration: 0.2, ease: "easeOut" },
      },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2, ease: "easeIn" },
        scale: { duration: 0.15, ease: "easeIn" },
      },
    }),
  };

  // Custom radio button for ratings
  const RatingButton = ({
    value,
    selected,
    onChange,
  }: {
    value: number;
    selected: boolean;
    onChange: (value: string) => void;
  }) => {
    return (
      <div className="flex flex-col items-center">
        <button
          type="button"
          onClick={() => onChange(value.toString())}
          className={`
            h-14 w-14 rounded-full flex items-center justify-center text-lg font-medium
            transition-all duration-200 shadow-sm
            ${
              selected
                ? "bg-primary text-white scale-100 shadow-md"
                : "bg-white text-gray-700 border-2 border-gray-200 hover:border-primary/50"
            }
          `}
        >
          {value}
        </button>
      </div>
    );
  };

  const downloadCSV = async (token: string) => {
    try {
      const res = await fetch("https://love-survery-api.injun.dev/export", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.message || "다운로드 실패");
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "submissions.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      alert("네트워크 오류 또는 권한 없음");
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case -1:
        return (
          <div className="space-y-6 text-center">
            <CardTitle className="className="text-2xl font-bold">
              AI 기반 연애 횟수 예측 설문조사
            </CardTitle>
              <p className="text-gray-600 text-sm leading-relaxed">
    이 설문은 <span className="font-semibold text-black">AI 연애 확률 예측 서비스</span>를 위한<br />
    데이터 수집 목적으로 진행됩니다.
    <br />
    <span className="text-blue-600 font-medium">Google 계정</span>은{" "}
    <span className="font-semibold">중복 응답 방지용</span>으로만 사용되며,
    <br />
    다른 용도로는 절대 사용되지 않습니다.
  </p>
            <GoogleLogin
              
              onSuccess={async (credentialResponse) => {
                if (credentialResponse.credential) {
                  const googleToken = credentialResponse.credential;
                  setToken(googleToken);

                  // 관리자 여부 확인 요청
                  try {
                    const res = await fetch(
                      "https://love-survery-api.injun.dev/export",
                      {
                        method: "GET",
                        headers: {
                          Authorization: `Bearer ${googleToken}`,
                        },
                      }
                    );

                    if (res.status === 200) {
                      setIsAdmin(true);
                      console.log("✅ 관리자입니다.");
                      return; // ✅ 관리자면 설문 시작하지 않고 리턴
                    } else {
                      setIsAdmin(false);
                    }
                  } catch (err) {
                    console.error("관리자 확인 실패:", err);
                    setIsAdmin(false);
                  }

                  setCurrentStep(0); // 설문 시작
                }
              }}
              onError={() => {
                console.log("로그인 실패");
              }}
              useOneTap={false}
             render={(renderProps) => (
      <button
        onClick={renderProps.onClick}
        disabled={renderProps.disabled}
        className="w-full h-12 rounded-full shadow-md bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold hover:from-blue-600 hover:to-indigo-600 transition"
      >
        🚀 Google 계정으로 설문 시작하기
      </button>
    )}
            />

            {isAdmin && token && (
              <Button
                onClick={() => downloadCSV(token)}
                className="w-full mt-4"
              >
                📥 설문 응답 CSV 다운로드 (관리자 전용)
              </Button>
            )}
          </div>
        );
      case 0:
        return (
          <div className="space-y-6 text-center">
            <CardTitle className="text-2xl font-bold">
              AI 기반 연애 횟수 예측 설문
            </CardTitle>
            <div className="text-left space-y-4 border rounded-lg p-4 bg-gray-50">
              <h3 className="font-semibold text-lg flex items-center">
                <span className="mr-2">📌</span> 개인정보 및 데이터 활용 동의
              </h3>
              <div className="space-y-2 text-gray-700">
                <p>
                  이 설문은 AI 기반 연애 예측 모델 개발을 위한 데이터 수집을
                  목적으로 합니다.
                </p>
                <p>
                  응답해주신 모든 정보는 익명으로 수집되며, AI 학습과 통계
                  분석에 활용됩니다.
                </p>
                <p>
                  개인 식별 정보는 수집되지 않으며, 외부로 제공되지 않습니다.
                </p>
                <p></p>
              </div>
              <div className="flex items-center space-x-2 mt-4">
                <Checkbox
                  id="agreement"
                  checked={agreementChecked}
                  onCheckedChange={(checked) => {
                    setAgreementChecked(checked === true);
                    if (checked) {
                      setErrors((prev) => ({ ...prev, agreement: undefined }));
                    }
                  }}
                />
                <Label htmlFor="agreement" className="text-sm">
                  위 내용을 모두 읽었으며, 설문 응답이 AI 개발에 사용되는 것에
                  동의합니다.
                </Label>
              </div>
              {errors.agreement && (
                <p className="text-sm text-red-500 font-medium">
                  {errors.agreement}
                </p>
              )}
            </div>
            <Button onClick={startSurvey} className="w-full">
              시작하기
            </Button>
          </div>
        );
      case 1:
        return (
          <div className="w-full space-y-6">
            <CardTitle>나이를 입력해주세요.</CardTitle>
            <div className="w-full space-y-2">
              <Input
                type="number"
                placeholder="나이"
                value={answers.age}
                onChange={(e) => updateAnswer("age", e.target.value)}
                className="w-[calc(100%-4px)] text-lg h-14 rounded-full shadow-sm mx-auto"
                min="1"
                step="1"
                onKeyDown={(e) => {
                  // Prevent decimal point
                  if (
                    e.key === "." ||
                    e.key === "e" ||
                    e.key === "-" ||
                    e.key === "+"
                  ) {
                    e.preventDefault();
                  }
                }}
              />
              {errors.age && (
                <p className="text-sm text-red-500 font-medium text-left">
                  {errors.age}
                </p>
              )}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="w-full space-y-6">
            <CardTitle>성별을 선택해주세요.</CardTitle>
            <div className="w-full space-y-2">
              <Select
                value={answers.gender}
                onValueChange={(value) => updateAnswer("gender", value)}
              >
                <SelectTrigger className="w-[calc(100%-4px)] text-lg h-14 rounded-full shadow-sm mx-auto">
                  <SelectValue placeholder="성별 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">남</SelectItem>
                  <SelectItem value="female">여</SelectItem>
                  <SelectItem value="other">기타</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && (
                <p className="text-sm text-red-500 font-medium text-left">
                  {errors.gender}
                </p>
              )}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="w-full space-y-6">
            <CardTitle>외모 자신감 정도를 1~5점으로 선택해주세요.</CardTitle>
            <div className="w-full space-y-2 text-center ">
              {/* 버튼 줄 */}
              <div className="flex inline-flex gap-6">
                {[1, 2, 3, 4, 5].map((value) => (
                  <div key={value} className="flex flex-col mx-auto">
                    <RatingButton
                      value={value}
                      selected={answers.appearance === value.toString()}
                      onChange={(val) => updateAnswer("appearance", val)}
                    />
                    {/* 텍스트는 1번과 5번일 때만 표시 */}
                    {value === 1 && (
                      <span className="text-sm text-gray-500 mt-1">
                        매우 낮음
                      </span>
                    )}
                    {value === 5 && (
                      <span className="text-sm text-gray-500 mt-1">
                        매우 높음
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* 에러 메시지 */}
              {errors.appearance && (
                <p className="text-sm text-red-500 font-medium text-left">
                  {errors.appearance}
                </p>
              )}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="w-full space-y-6">
            <CardTitle>말주변이 얼마나 있다고 생각하시나요?</CardTitle>
            <div className="w-full space-y-2 text-center">
              {/* 버튼 줄 */}
              <div className="flex inline-flex gap-6">
                {[1, 2, 3, 4, 5].map((value) => (
                  <div key={value} className="flex flex-col mx-auto">
                    <RatingButton
                      /*key={value}*/
                      value={value}
                      selected={answers.communication === value.toString()}
                      onChange={(val) => updateAnswer("communication", val)}
                    />
                    {/* 텍스트는 1번과 5번일 때만 표시 */}
                    {value === 1 && (
                      <span className="text-sm text-gray-500 mt-1">
                        매우 낮음
                      </span>
                    )}
                    {value === 5 && (
                      <span className="text-sm text-gray-500 mt-1">
                        매우 높음
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* 에러 메시지 */}
              {errors.communication && (
                <p className="text-sm text-red-500 font-medium text-left">
                  {errors.communication}
                </p>
              )}
            </div>
          </div>
        );
      case 5:
        return (
          <div className="w-full space-y-6">
            <CardTitle>낯가림 정도를 1~5로 평가해주세요. </CardTitle>
            <div className="w-full space-y-2 text-center">
              {/*<p className="text-sm text-gray-500">(1 = 없음, 5 = 매우 심함)</p>*/}
              <div className="flex inline-flex gap-6">
                {[1, 2, 3, 4, 5].map((value) => (
                  <div key={value} className="flex flex-col mx-autor">
                    <RatingButton
                      key={value}
                      value={value}
                      selected={answers.shyness === value.toString()}
                      onChange={(val) => updateAnswer("shyness", val)}
                    />
                    {value === 1 && (
                      <span className="text-sm text-gray-500 mt-1">
                        전혀 없음
                      </span>
                    )}
                    {value === 5 && (
                      <span className="text-sm text-gray-500 mt-1">
                        매우 높음
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* 에러 메시지 */}
              {errors.shyness && (
                <p className="text-sm text-red-500 font-medium text-left">
                  {errors.shyness}
                </p>
              )}
            </div>
          </div>
        );
      case 6:
        return (
          <div className="w-full space-y-6">
            <CardTitle>
              하루 평균 소셜미디어 사용 시간을 입력해주세요.
            </CardTitle>
            <div className="w-full space-y-2">
              <Input
                type="number"
                placeholder="시간"
                value={answers.socialMedia}
                onChange={(e) => updateAnswer("socialMedia", e.target.value)}
                className="w-[calc(100%-4px)] text-lg h-14 rounded-full shadow-sm mx-auto"
              />

              {errors.socialMedia && (
                <p className="text-sm text-red-500 font-medium">
                  {errors.socialMedia}
                </p>
              )}
            </div>
          </div>
        );
      case 7:
        return (
          <div className="w-full space-y-6">
            <CardTitle>
              최근 1년간 소개팅이나 만남 앱을 통한 만남 횟수를 입력해주세요.
            </CardTitle>
            <div className="w-full space-y-2">
              <Input
                type="number"
                placeholder="횟수"
                value={answers.blindDates}
                onChange={(e) => updateAnswer("blindDates", e.target.value)}
                className="w-[calc(100%-4px)] text-lg h-14 rounded-full shadow-sm mx-auto"
              />
              {errors.blindDates && (
                <p className="text-sm text-red-500 font-medium">
                  {errors.blindDates}
                </p>
              )}
            </div>
          </div>
        );
      case 8:
        return (
          <div className="w-full space-y-6">
            <CardTitle>가장 관심 있는 활동을 선택해주세요.</CardTitle>
            <div className="w-full space-y-2">
              <Select
                value={answers.interest}
                onValueChange={(value) => updateAnswer("interest", value)}
              >
                <SelectTrigger className="w-[calc(100%-4px)] text-lg h-14 rounded-full shadow-sm mx-auto">
                  <SelectValue placeholder="활동 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="exercise">운동</SelectItem>
                  <SelectItem value="game">게임</SelectItem>
                  <SelectItem value="music">음악</SelectItem>
                  <SelectItem value="movie">영화</SelectItem>
                  <SelectItem value="reading">독서</SelectItem>
                  <SelectItem value="study">공부</SelectItem>
                  <SelectItem value="travel">여행</SelectItem>
                  <SelectItem value="cooking">요리</SelectItem>
                  <SelectItem value="other">기타</SelectItem>
                </SelectContent>
              </Select>
              {errors.interest && (
                <p className="text-sm text-red-500 font-medium">
                  {errors.interest}
                </p>
              )}
            </div>
          </div>
        );
      case 9:
        return (
          <div className="w-full space-y-6">
            <CardTitle>MBTI를 입력해주세요.</CardTitle>
            <div className="w-full space-y-2">
              <Input
                type="text"
                placeholder="예: ENFP"
                value={answers.mbti}
                onChange={(e) =>
                  updateAnswer("mbti", e.target.value.toUpperCase())
                }
                className="w-[calc(100%-4px)] text-lg h-14 rounded-full shadow-sm mx-auto"
                maxLength={4}
              />
              {errors.mbti && (
                <p className="text-sm text-red-500 font-medium">
                  {errors.mbti}
                </p>
              )}
            </div>
          </div>
        );
      case 10:
        return (
          <div className="w-full space-y-6">
            <CardTitle>최근 1년간 연애한 횟수를 입력해주세요.</CardTitle>
            <div className="w-full space-y-2">
              <Input
                type="number"
                placeholder="횟수"
                value={answers.datingCount}
                onChange={(e) => updateAnswer("datingCount", e.target.value)}
                className="w-[calc(100%-4px)] text-lg h-14 rounded-full shadow-sm mx-auto"
              />
              {errors.datingCount && (
                <p className="text-sm text-red-500 font-medium">
                  {errors.datingCount}
                </p>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="pt-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center space-y-4 py-10"
            >
              <CheckCircle2 className="h-20 w-20 text-green-500" />
              <CardTitle className="text-2xl font-bold text-center">
                ✅ 설문이 성공적으로 제출되었습니다.
              </CardTitle>
              <p className="text-gray-600 text-center">감사합니다!</p>

              {/* ✅ 응답 요약 */}
              <div className="w-full px-2 sm:px-3 space-y-5">
                <CardTitle className="text-lg">
                  입력하신 내용을 확인해주세요
                </CardTitle>
                <div className="space-y-3 text-left text-sm">
                  {[
                    { label: "나이", value: `${answers.age}세` },
                    {
                      label: "성별",
                      value:
                        answers.gender === "male"
                          ? "남"
                          : answers.gender === "female"
                          ? "여"
                          : "기타",
                    },
                    { label: "외모 자신감", value: `${answers.appearance}/5` },
                    { label: "말주변", value: `${answers.communication}/5` },
                    { label: "낯가림 정도", value: `${answers.shyness}/5` },
                    {
                      label: "소셜미디어 사용 시간",
                      value: `${answers.socialMedia}시간`,
                    },
                    {
                      label: "소개팅/만남 앱 만남 횟수",
                      value: `${answers.blindDates}회`,
                    },
                    {
                      label: "관심 활동",
                      value:
                        answers.interest === "exercise"
                          ? "운동"
                          : answers.interest === "game"
                          ? "게임"
                          : answers.interest === "music"
                          ? "음악"
                          : answers.interest === "movie"
                          ? "영화"
                          : answers.interest === "reading"
                          ? "독서"
                          : answers.interest === "study"
                          ? "공부"
                          : answers.interest === "travel"
                          ? "여행"
                          : answers.interest === "cooking"
                          ? "요리"
                          : "기타",
                    },
                    { label: "MBTI", value: answers.mbti },
                    { label: "연애 횟수", value: `${answers.datingCount}회` },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="w-full p-2 bg-gray-50 rounded-lg flex justify-between items-center"
                    >
                      <span className="font-medium">{item.label}</span>
                      <span>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button onClick={resetSurvey} className="w-full mt-4">
                처음으로 돌아가기
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          {currentStep > 0 && currentStep <= totalSteps && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>
                  질문 {currentStep}/{totalSteps}
                </span>
                <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
              </div>
              <Progress
                value={(currentStep / totalSteps) * 100}
                className="h-2"
              />
            </div>
          )}
        </CardHeader>
        <CardContent>
          <motion.div animate={controls} className="w-full overflow-hidden">
            <AnimatePresence custom={direction} mode="wait" initial={false}>
              <motion.div
                key={currentStep}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                className="min-h-[300px] flex items-center" /*asdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasd*/
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </CardContent>
        <CardFooter className="flex justify-between">
          {currentStep > 0 && currentStep <= totalSteps && (
            <Button variant="outline" onClick={prevStep} className="shadow-sm">
              <ArrowLeft className="mr-2 h-4 w-4" /> 이전
            </Button>
          )}
          {currentStep === 0 ? <div></div> : null}
          {currentStep > 0 && currentStep < totalSteps && (
            <Button onClick={nextStep} className="shadow-sm">
              다음 <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
          {currentStep === totalSteps && (
            <Button onClick={handleSubmit} className="shadow-sm">
              제출하기 <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
          {currentStep === 11 ? <div></div> : null}
        </CardFooter>
      </Card>
    </div>
  );
}
