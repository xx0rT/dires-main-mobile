import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Star, Send, MessageSquare, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  user_email: string;
}

interface CourseReviewsSectionProps {
  courseId: string;
}

export function CourseReviewsSection({ courseId }: CourseReviewsSectionProps) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userRating, setUserRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [existingReview, setExistingReview] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, [courseId, user]);

  const loadReviews = async () => {
    try {
      const { data: ratingsData } = await supabase
        .from("course_ratings")
        .select("id, rating, comment, created_at, user_id")
        .eq("course_id", courseId)
        .order("created_at", { ascending: false });

      if (ratingsData && ratingsData.length > 0) {
        const userIds = ratingsData.map((r) => r.user_id);
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, email, full_name")
          .in("id", userIds);

        const profileMap = new Map<string, string>();
        if (profiles) {
          for (const p of profiles) {
            const name = p.full_name || p.email?.split("@")[0] || "Uzivatel";
            profileMap.set(p.id, name);
          }
        }

        setReviews(
          ratingsData.map((r) => ({
            id: r.id,
            rating: r.rating,
            comment: r.comment || "",
            created_at: r.created_at,
            user_email: profileMap.get(r.user_id) || "Uzivatel",
          }))
        );

        if (user) {
          const userReview = ratingsData.find((r) => r.user_id === user.id);
          if (userReview) {
            setExistingReview(true);
            setUserRating(userReview.rating);
            setComment(userReview.comment || "");
          }
        }
      }
    } catch (err) {
      console.error("Error loading reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!user || userRating === 0) return;
    setSubmitting(true);

    try {
      await supabase.from("course_ratings").upsert(
        {
          user_id: user.id,
          course_id: courseId,
          rating: userRating,
          comment,
          lessons_completed: 0,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,course_id" }
      );

      toast.success(existingReview ? "Hodnoceni aktualizovano!" : "Dekujeme za hodnoceni!");
      setExistingReview(true);
      await loadReviews();
    } catch {
      toast.error("Chyba pri odesilani hodnoceni");
    } finally {
      setSubmitting(false);
    }
  };

  const displayRating = hoveredStar || userRating;
  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;
  const reviewsWithComment = reviews.filter((r) => r.comment.trim().length > 0);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("cs-CZ", { day: "numeric", month: "long", year: "numeric" });
  };

  if (loading) return null;

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="p-5 border-b bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Star className="h-4 w-4 text-amber-500" />
            </div>
            <div>
              <h3 className="font-semibold">Hodnoceni kurzu</h3>
              {reviews.length > 0 && (
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={cn(
                          "h-3 w-3",
                          s <= Math.round(avgRating)
                            ? "fill-amber-400 text-amber-400"
                            : "text-muted-foreground/30"
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {avgRating.toFixed(1)} ({reviews.length} hodnoceni)
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {user && (
          <div className="p-5 border-b">
            <p className="text-sm font-medium mb-3">
              {existingReview ? "Vase hodnoceni" : "Ohodnofte tento kurz"}
            </p>
            <div className="flex items-center gap-1.5 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                  key={star}
                  type="button"
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setUserRating(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  className="p-0.5 focus:outline-none"
                >
                  <Star
                    className={cn(
                      "h-7 w-7 transition-colors duration-150",
                      star <= displayRating
                        ? "fill-amber-400 text-amber-400"
                        : "text-muted-foreground/25"
                    )}
                  />
                </motion.button>
              ))}
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Podelte se o svuj nazor na kurz (volitelne)..."
              rows={3}
              className="w-full rounded-lg border bg-muted/30 px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all placeholder:text-muted-foreground/50"
            />
            <div className="flex justify-end mt-3">
              <Button
                size="sm"
                disabled={userRating === 0 || submitting}
                onClick={handleSubmit}
                className="gap-1.5"
              >
                <Send className="h-3.5 w-3.5" />
                {existingReview ? "Aktualizovat" : "Odeslat hodnoceni"}
              </Button>
            </div>
          </div>
        )}

        {reviewsWithComment.length > 0 ? (
          <div className="divide-y">
            <AnimatePresence>
              {reviewsWithComment.map((review, i) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium truncate">
                          {review.user_email}
                        </span>
                        <span className="text-xs text-muted-foreground flex-shrink-0">
                          {formatDate(review.created_at)}
                        </span>
                      </div>
                      <div className="flex items-center gap-0.5 mb-1.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={cn(
                              "h-3 w-3",
                              s <= review.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-muted-foreground/25"
                            )}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="p-8 text-center">
            <MessageSquare className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              Zatim zadne recenze. Budte prvni!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
