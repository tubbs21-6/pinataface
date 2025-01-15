import React, { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Camera,
  Hammer,
  RotateCcw,
  ChevronRight,
  Check,
  Sparkles,
  Palette,
  Scissors,
  Package,
  Video,
  Book,
  Ruler,
  Play,
  PauseCircle,
  Download,
} from "lucide-react";
import Confetti from "react-confetti";
import { PinataModel } from "./PinataModel";
import { ConstructionSteps } from "./ConstructionSteps";
import { VideoTutorial } from "./VideoTutorial";
const ThreeDPinata = ({ image, rotation }) => {
  return (
    <div className="relative w-full aspect-square perspective-1000">
      <motion.div
        className="relative w-full h-full preserve-3d"
        animate={{
          rotateY: rotation,
        }}
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            transform: "translateZ(100px)",
            backfaceVisibility: "hidden",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            transform: "translateZ(-100px) rotateY(180deg)",
            backfaceVisibility: "hidden",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            transform: "translateX(-100px) rotateY(-90deg)",
            backfaceVisibility: "hidden",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            transform: "translateX(100px) rotateY(90deg)",
            backfaceVisibility: "hidden",
          }}
        />
      </motion.div>
    </div>
  );
};
const BusinessPinata = () => {
  const [stage, setStage] = useState(0);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [customizations, setCustomizations] = useState({
    shape: "octagon",
    texture: "paper",
    frills: true,
    ribbons: true,
  });
  const [buildStep, setBuildStep] = useState(0);
  const [paintProgress, setPaintProgress] = useState(0);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("preview");
  const [isPlaying, setIsPlaying] = useState(false);
  useEffect(() => {
    if (stage === 3) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, [stage]);
  useEffect(() => {
    if (stage === 1) {
      const interval = setInterval(() => {
        setBuildStep((prev) => {
          if (prev < 4) return prev + 1;
          clearInterval(interval);
          return prev;
        });
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [stage]);
  const handleImageUpload = useCallback((file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedImage(event.target.result);
      setStage(1);
    };
    reader.readAsDataURL(file);
  }, []);
  const isValidFileType = (file) => {
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!validTypes.includes(file.type)) {
      setError(
        "Please upload a valid image file (JPG, JPEG, PNG, GIF, or WEBP)",
      );
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File size should be less than 5MB");
      return false;
    }
    setError("");
    return true;
  };
  const renderPinataPreview = (stage) => {
    if (!uploadedImage) return null;
    const baseStyles = {
      background: `url(${uploadedImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    };
    return (
      <motion.div
        className="relative w-full aspect-square rounded-lg overflow-hidden shadow-xl"
        whileHover={{
          scale: 1.05,
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            ...baseStyles,
            filter: "brightness(0.9)",
            clipPath:
              "polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)",
          }}
        />
        {stage >= 2 && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/30 to-pink-500/30"
          />
        )}
        {customizations.texture === "paper" && (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1516976905907-818d52c84bf7?auto=format&fit=crop&q=80&w=1000')",
              opacity: 0.2,
              mixBlendMode: "overlay",
            }}
          />
        )}
        {customizations.frills && stage >= 2 && (
          <motion.div
            initial={{
              scale: 0,
            }}
            animate={{
              scale: 1,
            }}
            className="absolute -top-2 -left-2 -right-2 h-4"
            style={{
              background:
                "repeating-linear-gradient(90deg, #FF69B4, #FF69B4 10px, transparent 10px, transparent 20px)",
            }}
          />
        )}
        {customizations.ribbons && stage >= 2 && (
          <motion.div
            initial={{
              y: 50,
            }}
            animate={{
              y: 0,
            }}
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
          >
            <div className="w-4 h-20 bg-gradient-to-b from-pink-400 to-purple-500" />
          </motion.div>
        )}
      </motion.div>
    );
  };
  const renderPinataProcess = (step) => {
    if (!uploadedImage) return null;
    return (
      <div className="space-y-4">
        <PinataModel
          imageUrl={uploadedImage}
          constructionStep={buildStep}
          paintProgress={paintProgress}
        />
        <ConstructionSteps
          currentStep={buildStep}
          onStepClick={handleBuildStepClick}
          progress={paintProgress}
        />
      </div>
    );
  };
  const renderStage1Content = () => (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
      }}
      className="space-y-8"
    >
      <div className="flex gap-8">
        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-4 text-white">
            Building Process
          </h3>
          <div className="space-y-4 bg-white/20 p-6 rounded-lg">
            <div className="space-y-6">
              {[
                {
                  icon: Package,
                  text: "Prepare Mannequin Base",
                  description: "Creating base structure...",
                },
                {
                  icon: Scissors,
                  text: "Layer Paper Structure",
                  description: "Adding paper layers...",
                },
                {
                  icon: Camera,
                  text: "Map Facial Features",
                  description: "Mapping face details...",
                },
                {
                  icon: Palette,
                  text: "Apply Paint Details",
                  description: "Finalizing design...",
                },
              ].map((step, index) => (
                <motion.div
                  key={step.text}
                  className={`flex items-center gap-4 p-3 rounded-lg ${buildStep >= index ? "bg-white/20" : "opacity-50"}`}
                  whileHover={{
                    scale: 1.02,
                  }}
                  onClick={() => handleBuildStepClick(index)}
                  style={{
                    cursor: "pointer",
                  }}
                >
                  <step.icon className="w-6 h-6 text-pink-400" />
                  <div className="flex-1">
                    <span className="text-white">{step.text}</span>
                    {buildStep === index && (
                      <motion.p
                        initial={{
                          opacity: 0,
                        }}
                        animate={{
                          opacity: 1,
                        }}
                        className="text-sm text-pink-300"
                      >
                        {step.description}
                      </motion.p>
                    )}
                  </div>
                  {buildStep === index && (
                    <motion.div
                      className="ml-auto w-6 h-6 rounded-full bg-pink-500"
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 1,
                      }}
                    />
                  )}
                </motion.div>
              ))}
            </div>
            {buildStep === 3 && (
              <motion.div
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                className="mt-4"
              >
                <label className="text-white mb-2 block">Paint Progress</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={paintProgress}
                  onChange={(e) => setPaintProgress(parseInt(e.target.value))}
                  className="w-full"
                />
              </motion.div>
            )}
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-4 text-white">
            Live Preview
          </h3>
          {renderPinataProcess(buildStep)}
        </div>
      </div>
    </motion.div>
  );
  const renderStage2Content = () => (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
      }}
      className="space-y-8"
    >
      <div className="flex gap-8">
        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-4 text-white">
            Customize Your Piñata
          </h3>
          <div className="space-y-4 bg-white/20 p-6 rounded-lg">
            <div>
              <label className="text-white mb-2 block">Texture</label>
              <select
                className="w-full bg-white/10 text-white border border-pink-500/30 rounded-lg p-2"
                value={customizations.texture}
                onChange={(e) =>
                  setCustomizations({
                    ...customizations,
                    texture: e.target.value,
                  })
                }
              >
                <option value="paper">Crepe Paper</option>
                <option value="smooth">Smooth</option>
                <option value="rough">Rough</option>
              </select>
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-white">
                <input
                  type="checkbox"
                  checked={customizations.frills}
                  onChange={(e) =>
                    setCustomizations({
                      ...customizations,
                      frills: e.target.checked,
                    })
                  }
                  className="rounded border-pink-500"
                />
                Add Frills
              </label>
              <label className="flex items-center gap-2 text-white">
                <input
                  type="checkbox"
                  checked={customizations.ribbons}
                  onChange={(e) =>
                    setCustomizations({
                      ...customizations,
                      ribbons: e.target.checked,
                    })
                  }
                  className="rounded border-pink-500"
                />
                Add Ribbons
              </label>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-4 text-white">
            Live Preview
          </h3>
          {renderPinataPreview(2)}
        </div>
      </div>
    </motion.div>
  );
  const renderStage3Content = () => (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
      }}
      className="space-y-8"
    >
      <div className="flex gap-4 border-b border-pink-500/20">
        <motion.button
          className={`flex items-center gap-2 px-6 py-3 text-white relative ${activeTab === "preview" ? "text-pink-300" : "text-white/70"}`}
          onClick={() => setActiveTab("preview")}
          whileHover={{
            scale: 1.05,
          }}
        >
          <Camera className="w-4 h-4" />
          3D Preview
          {activeTab === "preview" && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-500"
            />
          )}
        </motion.button>
        <motion.button
          className={`flex items-center gap-2 px-6 py-3 text-white relative ${activeTab === "specs" ? "text-pink-300" : "text-white/70"}`}
          onClick={() => setActiveTab("specs")}
          whileHover={{
            scale: 1.05,
          }}
        >
          <Ruler className="w-4 h-4" />
          Specifications
          {activeTab === "specs" && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-500"
            />
          )}
        </motion.button>
        <motion.button
          className={`flex items-center gap-2 px-6 py-3 text-white relative ${activeTab === "diy" ? "text-pink-300" : "text-white/70"}`}
          onClick={() => setActiveTab("diy")}
          whileHover={{
            scale: 1.05,
          }}
        >
          <div className="w-4 h-4" />
          DIY Guide
          {activeTab === "diy" && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-500"
            />
          )}
        </motion.button>
        <motion.button
          className={`flex items-center gap-2 px-6 py-3 text-white relative ${activeTab === "tutorials" ? "text-pink-300" : "text-white/70"}`}
          onClick={() => setActiveTab("tutorials")}
          whileHover={{
            scale: 1.05,
          }}
        >
          <Video className="w-4 h-4" />
          Video Tutorials
          {activeTab === "tutorials" && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-500"
            />
          )}
        </motion.button>
      </div>
      <AnimatePresence mode="wait">
        {activeTab === "preview" && (
          <motion.div
            key="preview"
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -20,
            }}
            className="grid grid-cols-2 gap-8"
          >
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-white">
                Your 3D Piñata
              </h3>
              <div className="relative aspect-square bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-lg overflow-hidden">
                <PinataModel
                  imageUrl={uploadedImage}
                  constructionStep={4}
                  paintProgress={100}
                />
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-white mb-4">
                  Final Specifications
                </h4>
                <div className="space-y-3">
                  {[
                    {
                      label: "Dimensions",
                      value: '24" x 24" x 30"',
                    },
                    {
                      label: "Weight",
                      value: "2.5 lbs",
                    },
                    {
                      label: "Material",
                      value: "Premium Crepe Paper",
                    },
                    {
                      label: "Print Quality",
                      value: "300 DPI",
                    },
                    {
                      label: "Assembly Time",
                      value: "4-6 Hours",
                    },
                  ].map((spec) => (
                    <div
                      key={spec.label}
                      className="flex justify-between text-pink-100"
                    >
                      <span className="text-pink-200">{spec.label}</span>
                      <span>{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
        {activeTab === "specs" && (
          <motion.div
            key="specs"
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -20,
            }}
            className="space-y-6"
          >
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
              <h4 className="text-lg font-semibold text-white mb-4">
                Materials List
              </h4>
              <ul className="space-y-2">
                {[
                  "Premium crepe paper",
                  "Reinforced cardboard frame",
                  "Custom printed panels",
                  "Industrial-grade adhesive",
                  "Hanging mechanism",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-pink-100"
                  >
                    <Check className="w-4 h-4 text-pink-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
        {activeTab === "diy" && (
          <motion.div
            key="diy"
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -20,
            }}
            className="space-y-6"
          >
            <ConstructionSteps
              currentStep={4}
              onStepClick={() => {}}
              progress={100}
            />
          </motion.div>
        )}
        {activeTab === "tutorials" && (
          <motion.div
            key="tutorials"
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -20,
            }}
            className="grid grid-cols-2 gap-6"
          >
            {[
              {
                title: "Basic Assembly",
                duration: "15:00",
                thumbnail:
                  "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=1000",
              },
              {
                title: "Adding Details",
                duration: "12:30",
                thumbnail:
                  "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=1000",
              },
            ].map((video) => (
              <VideoTutorial
                key={video.title}
                {...video}
                onPlay={() => console.log(`Playing ${video.title}`)}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
  const handleBuildStepClick = (index) => {
    setBuildStep(index);
    if (index === 3) {
      setPaintProgress(100);
    } else if (index === 0) {
      setPaintProgress(0);
    }
  };
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {showConfetti && <Confetti />}
      <header className="relative w-full bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white p-8">
        <motion.div
          initial={{
            y: -20,
            opacity: 0,
          }}
          animate={{
            y: 0,
            opacity: 1,
          }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl font-bold flex items-center gap-2">
            <Sparkles className="w-8 h-8" />
            Magic Piñata Creator
          </h1>
          <p className="mt-2 opacity-90 text-xl">
            Create your magical custom piñata adventure!
          </p>
        </motion.div>
      </header>
      <main className="relative max-w-4xl mx-auto p-6">
        <motion.div
          className="flex justify-between mb-8"
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
        >
          {["Upload Image", "Customize", "Preview", "Finalize"].map(
            (step, i) => (
              <motion.div
                key={step}
                className="flex items-center"
                whileHover={{
                  scale: 1.05,
                }}
              >
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${i <= stage ? "bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white" : "bg-gray-200 text-gray-600"}`}
                  whileHover={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 0.5,
                  }}
                >
                  {i < stage ? <Check className="w-6 h-6" /> : i + 1}
                </motion.div>
                <span
                  className={`ml-2 ${i <= stage ? "text-pink-300" : "text-gray-400"}`}
                >
                  {step}
                </span>
                {i < 3 && (
                  <motion.div
                    className={`w-12 h-1 mx-2 rounded-full ${i < stage ? "bg-gradient-to-r from-fuchsia-500 to-pink-500" : "bg-gray-200"}`}
                    initial={{
                      scaleX: 0,
                    }}
                    animate={{
                      scaleX: 1,
                    }}
                    transition={{
                      delay: i * 0.2,
                    }}
                  />
                )}
              </motion.div>
            ),
          )}
        </motion.div>
        <motion.div
          className="bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl p-8 min-h-[500px]"
          initial={{
            opacity: 0,
            scale: 0.95,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 0.5,
          }}
        >
          <AnimatePresence mode="wait">
            {stage === 0 && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -20,
                }}
                className="flex flex-col items-center"
              >
                <motion.div
                  className="w-full max-w-md border-2 border-dashed border-pink-300 rounded-lg p-8 flex flex-col items-center cursor-pointer hover:border-pink-500 transition-all relative"
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 0 20px rgba(255,182,193,0.3)",
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.add("border-pink-500");
                  }}
                  onDragLeave={(e) => {
                    e.currentTarget.classList.remove("border-pink-500");
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove("border-pink-500");
                    const file = e.dataTransfer?.files[0];
                    if (file && isValidFileType(file)) {
                      handleImageUpload(file);
                    }
                  }}
                >
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.gif,.webp"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file && isValidFileType(file)) {
                        handleImageUpload(file);
                      }
                    }}
                    className="hidden"
                    id="imageUpload"
                  />
                  <label
                    htmlFor="imageUpload"
                    className="cursor-pointer text-center w-full"
                  >
                    <motion.div
                      animate={{
                        rotate: [0, 10, -10, 0],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 2,
                      }}
                      className="relative"
                    >
                      <Upload className="w-16 h-16 text-pink-400 mb-4 mx-auto" />
                      <motion.div
                        className="absolute inset-0 bg-pink-400/20 rounded-full"
                        animate={{
                          scale: [1, 1.2, 1],
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.5,
                        }}
                      />
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-2 text-white">
                      Upload Your Image
                    </h3>
                    <p className="text-pink-200 mb-2">
                      Drop your image here or click to browse
                    </p>
                    <p className="text-pink-200/70 text-sm mb-4">
                      Supported formats: JPG, JPEG, PNG, GIF, WEBP
                    </p>
                    <motion.button
                      className="bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white px-8 py-3 rounded-full text-lg font-semibold group relative overflow-hidden"
                      whileHover={{
                        scale: 1.05,
                      }}
                      whileTap={{
                        scale: 0.95,
                      }}
                    >
                      <span className="relative z-10">Select Image</span>
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-pink-500 to-fuchsia-500"
                        initial={{
                          x: "100%",
                        }}
                        whileHover={{
                          x: 0,
                        }}
                        transition={{
                          type: "tween",
                        }}
                      />
                    </motion.button>
                  </label>
                </motion.div>
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: -10,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        y: -10,
                      }}
                      className="mt-4 text-red-400 text-sm"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
            {stage === 1 && uploadedImage && renderStage1Content()}
            {stage === 2 && uploadedImage && renderStage2Content()}
            {stage === 3 && uploadedImage && renderStage3Content()}
          </AnimatePresence>
          <div className="flex justify-end mt-8 gap-4">
            {stage > 0 && (
              <motion.button
                onClick={() => setStage(stage - 1)}
                className="px-6 py-2 text-pink-200 hover:text-white transition-colors"
                whileHover={{
                  scale: 1.05,
                }}
                whileTap={{
                  scale: 0.95,
                }}
              >
                Back
              </motion.button>
            )}
            {stage < 3 && uploadedImage && (
              <motion.button
                onClick={() => setStage(stage + 1)}
                className="bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white px-8 py-3 rounded-full flex items-center gap-2 text-lg font-semibold group relative overflow-hidden"
                whileHover={{
                  scale: 1.05,
                }}
                whileTap={{
                  scale: 0.95,
                }}
              >
                <span className="relative z-10">Continue</span>
                <ChevronRight className="w-5 h-5 relative z-10" />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-pink-500 to-fuchsia-500"
                  initial={{
                    x: "100%",
                  }}
                  whileHover={{
                    x: 0,
                  }}
                  transition={{
                    type: "tween",
                  }}
                />
              </motion.button>
            )}
          </div>
        </motion.div>
        <motion.div
          className="mt-8 grid grid-cols-3 gap-6"
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.3,
          }}
        >
          {[
            {
              title: "Premium Materials",
              description:
                "High-quality materials ensure your piñata will be perfect for any celebration.",
              icon: Sparkles,
            },
            {
              title: "Custom Design",
              description:
                "Each piñata is handcrafted to perfectly incorporate your image.",
              icon: Camera,
            },
            {
              title: "Quick Turnaround",
              description:
                "Fast production and shipping to meet your event deadline.",
              icon: Hammer,
            },
          ].map(({ title, description, icon: Icon }) => (
            <motion.div
              key={title}
              className="p-6 bg-white/10 backdrop-blur-sm rounded-xl"
              whileHover={{
                scale: 1.05,
                backgroundColor: "rgba(255,255,255,0.15)",
              }}
            >
              <motion.div
                whileHover={{
                  rotate: 360,
                }}
                transition={{
                  duration: 0.5,
                }}
                className="mb-3"
              >
                <Icon className="w-6 h-6 text-pink-400" />
              </motion.div>
              <h3 className="font-semibold mb-2 text-white">{title}</h3>
              <p className="text-pink-200">{description}</p>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
};
export const App = BusinessPinata;

