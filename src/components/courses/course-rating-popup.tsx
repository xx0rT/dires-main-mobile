import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Star, X, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CourseRatingPopupProps {
  visible: boolean;
  courseTitle: string;
  lessonsCompleted: number;
  onSubmit: (rating: number, comment: string) => Promise<void>;
  onClose: () => void;
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.85, y: 40 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring" as const, damping: 25, stiffness: 350, delay: 0.1 },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 20,
    transition: { duration: 0.2, ease: "easeIn" as const },
  },
};

const starContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.3 },
  },
};

const starVariants = {
  hidden: { opacity: 0, scale: 0, rotate: -30 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { type: "spring" as const, damping: 12, stiffness: 200 },
  },
};

const successVariants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring" as const, damping: 15, stiffness: 200 },
  },
};

export function CourseRatingPopup({
  visible,
  courseTitle,
  lessonsCompleted,
  onSubmit,
  onClose,
}: CourseRatingPopupProps) {
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const starLabels = [
    "",
    "Spatne",
    "Ujde to",
    "Dobre",
    "Velmi dobre",
    "Vyborne",
  ];

  const handleSubmit = async () => {
    if (rating === 0) return;
    setSubmitting(true);
    try {
      await onSubmit(rating, comment);
      setSubmitted(true);
      setTimeout(() => {
        onClose();
        setSubmitted(false);
        setRating(0);
        setComment("");
      }, 2000);
    } catch {
      setSubmitting(false);
    }
  };

  const handleSkip = () => {
    onClose();
    setRating(0);
    setComment("");
    setSubmitted(false);
    setSubmitting(false);
  };

  const displayRating = hoveredStar || rating;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{ duration: 0.25 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleSkip}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="relative w-full max-w-md bg-card rounded-3xl border shadow-2xl overflow-hidden"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500" />

            <button
              type="button"
              onClick={handleSkip}
              className="absolute top-4 right-4 p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors z-10"
            >
              <X className="h-4 w-4" />
            </button>

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  variants={successVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="p-8 flex flex-col items-center text-center gap-4"
                >
                  <motion.div
                    className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  >
                    <Sparkles className="h-10 w-10 text-emerald-500" />
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">Dekujeme!</h3>
                    <p className="text-sm text-muted-foreground">
                      Vase hodnoceni nam pomaha zlepsovat kurzy.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.15 } }}
                  className="p-6 pt-8"
                >
                  <div className="text-center mb-6">
                    <motion.div
                      className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-4"
                      initial={{ scale: 0, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
                    >
                      <Star className="h-7 w-7 text-amber-500" />
                    </motion.div>
                    <h2 className="text-xl font-bold tracking-tight mb-1">
                      Jak se vam kurz libi?
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Dokoncili jste {lessonsCompleted} lekci v kurzu{" "}
                      <span className="font-medium text-foreground">{courseTitle}</span>
                    </p>
                  </div>

                  <motion.div
                    className="flex items-center justify-center gap-2 mb-3"
                    variants={starContainerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.button
                        key={star}
                        type="button"
                        variants={starVariants}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredStar(star)}
                        onMouseLeave={() => setHoveredStar(0)}
                        className="p-1 focus:outline-none"
                      >
                        <Star
                          className={cn(
                            "h-9 w-9 transition-colors duration-150",
                            star <= displayRating
                              ? "fill-amber-400 text-amber-400"
                              : "text-muted-foreground/30"
                          )}
                        />
                      </motion.button>
                    ))}
                  </motion.div>

                  <motion.p
                    className="text-center text-sm font-medium h-5 mb-5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: displayRating > 0 ? 1 : 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    {starLabels[displayRating] || ""}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Napiste nam svuj nazor (volitelne)..."
                      rows={3}
                      className="w-full rounded-xl border bg-muted/30 px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all placeholder:text-muted-foreground/50"
                    />
                  </motion.div>

                  <motion.div
                    className="flex gap-3 mt-5"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Button
                      variant="ghost"
                      className="flex-1"
                      onClick={handleSkip}
                    >
                      Preskocit
                    </Button>
                    <Button
                      className="flex-1 gap-2"
                      disabled={rating === 0 || submitting}
                      onClick={handleSubmit}
                    >
                      {submitting ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        >
                          <Send className="h-4 w-4" />
                        </motion.div>
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                      Odeslat
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
