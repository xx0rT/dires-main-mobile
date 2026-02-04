"use client";

import { BadgeCheck, ThumbsUp } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

import { Rating } from "@/components/shadcnblocks/rating";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Review {
  id: string;
  rating: number;
  title: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
  };
  date: string;
  verified?: boolean;
  images?: string[];
  helpful?: number;
  variant?: string;
}

const DEFAULT_REVIEWS: Review[] = [
  {
    id: "1",
    rating: 5,
    title: "Absolutely stunning quality",
    content:
      "The craftsmanship on this is incredible. Photos don't do it justice - it looks even better in person. The material feels premium and the fit is perfect. I've already gotten so many compliments!",
    author: {
      name: "Sarah M.",
      avatar: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-1.webp",
    },
    date: "Dec 10, 2024",
    verified: true,
    images: [
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/Person-in-Activewear-1.png",
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/Fashionable-Woman-in-Monochrome-Attire-1.png",
    ],
    helpful: 24,
    variant: "Size M, Navy Blue",
  },
  {
    id: "2",
    rating: 4,
    title: "Great product, minor sizing issue",
    content:
      "Love the quality and design. Runs slightly small so I'd recommend sizing up. Other than that, it's exactly what I was looking for. Fast shipping too!",
    author: {
      name: "James R.",
      avatar: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-2.webp",
    },
    date: "Dec 8, 2024",
    verified: true,
    helpful: 18,
    variant: "Size L, Black",
  },
  {
    id: "3",
    rating: 5,
    title: "My new favorite!",
    content:
      "I've been searching for something like this for months. The attention to detail is amazing - from the stitching to the hardware, everything is top notch. Worth every penny.",
    author: {
      name: "Emily K.",
      avatar: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-3.webp",
    },
    date: "Dec 5, 2024",
    verified: true,
    images: ["https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/clothes/elegant-peach-scarf.png"],
    helpful: 31,
    variant: "One Size, Cream",
  },
  {
    id: "4",
    rating: 5,
    title: "Exceeded expectations",
    content:
      "Was hesitant to order online but so glad I did. The color is exactly as shown and the quality is exceptional. Customer service was also very responsive when I had questions about care instructions.",
    author: {
      name: "Michael T.",
    },
    date: "Dec 2, 2024",
    verified: false,
    helpful: 12,
  },
  {
    id: "5",
    rating: 4,
    title: "Beautiful but pricey",
    content:
      "The product is gorgeous and well-made. I debated for a while because of the price, but ultimately happy with my purchase. Would love to see more color options in the future.",
    author: {
      name: "Lisa P.",
      avatar: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar-5.webp",
    },
    date: "Nov 28, 2024",
    verified: true,
    images: ["https://deifkwefumgah.cloudfront.net/shadcnblocks/block/ecommerce/accessories/Elegant-Gold-Earrings-1.png"],
    helpful: 8,
    variant: "Gold",
  },
];

interface Reviews3Props {
  reviews?: Review[];
  title?: string;
  className?: string;
}

const Reviews3 = ({
  reviews = DEFAULT_REVIEWS,
  title = "Customer Reviews",
  className,
}: Reviews3Props) => {
  const [helpfulClicked, setHelpfulClicked] = useState<Set<string>>(new Set());

  const totalReviews = reviews.length;
  const averageRating =
    reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;

  const handleHelpful = (reviewId: string) => {
    setHelpfulClicked((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
      } else {
        newSet.add(reviewId);
      }
      return newSet;
    });
  };

  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="container mx-auto max-w-3xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              {title}
            </h2>
            <div className="mt-2 flex items-center gap-2">
              <Rating rate={averageRating} className="[&_svg]:size-5" />
              <span className="text-lg font-semibold">
                {averageRating.toFixed(1)}
              </span>
              <span className="text-sm text-muted-foreground">
                ({totalReviews} hodnocení)
              </span>
            </div>
          </div>
          <Button variant="outline">Napsat hodnocení</Button>
        </div>

        <div className="space-y-0">
          {reviews.map((review, index) => (
            <div key={review.id}>
              {index > 0 && <Separator className="my-6" />}
              <Card className="border-0 p-0 shadow-none">
                <CardContent className="space-y-4 p-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-10">
                        <AvatarImage
                          src={review.author.avatar}
                          alt={review.author.name}
                        />
                        <AvatarFallback>
                          {review.author.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {review.author.name}
                          </span>
                          {review.verified && (
                            <span className="flex items-center gap-1 text-emerald-600">
                              <BadgeCheck className="size-4" />
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{review.date}</span>
                          {review.variant && (
                            <>
                              <span>·</span>
                              <span>{review.variant}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <Rating
                      rate={review.rating}
                      className="[&_svg]:size-4 [&>div]:size-4"
                    />
                  </div>

                  <div>
                    <h3 className="font-medium">{review.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {review.content}
                    </p>
                  </div>

                  {review.images && review.images.length > 0 && (
                    <div className="flex gap-2">
                      {review.images.map((image, imgIndex) => (
                        <div
                          key={imgIndex}
                          className="size-20 overflow-hidden rounded-lg sm:size-24"
                        >
                          <AspectRatio ratio={1}>
                            <img
                              src={image}
                              alt={`Review image ${imgIndex + 1}`}
                              className="size-full object-cover"
                            />
                          </AspectRatio>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "h-8 gap-1.5 text-muted-foreground",
                        helpfulClicked.has(review.id) && "text-foreground",
                      )}
                      onClick={() => handleHelpful(review.id)}
                    >
                      <ThumbsUp
                        className={cn(
                          "size-4",
                          helpfulClicked.has(review.id) && "fill-current",
                        )}
                      />
                      Užitečné
                      {review.helpful !== undefined && (
                        <span>
                          (
                          {review.helpful +
                            (helpfulClicked.has(review.id) ? 1 : 0)}
                          )
                        </span>
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-muted-foreground"
                    >
                      Nahlásit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { Reviews3 };
