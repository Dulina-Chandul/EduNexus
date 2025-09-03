import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  CreditCard,
  Plus,
  BookOpen,
  Clock,
  Target,
  Sparkles,
  Trash2,
  Play,
  RotateCcw,
  CheckCircle,
  X,
  Loader2,
  Upload,
  Zap,
} from "lucide-react";

import {
  generateFlashcardsAPI,
  getFlashcardDecksAPI,
  getStudySessionAPI,
  updateFlashcardReviewAPI,
  deleteFlashcardDeckAPI,
} from "../../../APIservices/users/studentAPI";

const SmartFlashcards = () => {
  const [activeTab, setActiveTab] = useState("decks");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [currentDeck, setCurrentDeck] = useState(null);
  const [currentCard, setCurrentCard] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [studyCards, setStudyCards] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    content: "",
  });

  const queryClient = useQueryClient();

  const { data: decksResponse, isLoading: decksLoading } = useQuery({
    queryKey: ["flashcard-decks"],
    queryFn: getFlashcardDecksAPI,
  });

  const decks = decksResponse?.decks || [];

  const generateMutation = useMutation({
    mutationFn: generateFlashcardsAPI,
    onSuccess: () => {
      queryClient.invalidateQueries(["flashcard-decks"]);
      setShowCreateForm(false);
      setFormData({ title: "", subject: "", content: "" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteFlashcardDeckAPI,
    onSuccess: () => {
      queryClient.invalidateQueries(["flashcard-decks"]);
    },
  });

  const reviewMutation = useMutation({
    mutationFn: ({ flashcardId, confidenceLevel }) =>
      updateFlashcardReviewAPI(flashcardId, { confidenceLevel }),
    onSuccess: () => {
      handleNextCard();
    },
  });

  const handleStartStudy = async (deckId) => {
    try {
      const response = await getStudySessionAPI(deckId);
      const { deck, flashcards } = response.data;

      if (flashcards.length === 0) {
        alert("No cards due for review in this deck!");
        return;
      }

      setCurrentDeck(deck);
      setStudyCards(flashcards);
      setCurrentCard(0);
      setShowAnswer(false);
      setActiveTab("study");
    } catch (error) {
      console.error("Failed to start study session:", error);
    }
  };

  const handleNextCard = () => {
    if (currentCard < studyCards.length - 1) {
      setCurrentCard(currentCard + 1);
      setShowAnswer(false);
    } else {
      setActiveTab("decks");
      setCurrentDeck(null);
      setStudyCards([]);
      setCurrentCard(0);
    }
  };

  const handleConfidenceRating = (confidenceLevel) => {
    const flashcardId = studyCards[currentCard]._id;
    reviewMutation.mutate({ flashcardId, confidenceLevel });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.subject || !formData.content) return;
    generateMutation.mutate(formData);
  };

  return (
    <div className="space-y-6 p-4 max-w-7xl mx-auto">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 dark:from-primary-dark/30 dark:via-primary-dark/20 dark:to-accent-dark/30 p-6 border border-primary/30 dark:border-primary-dark/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary/20 dark:bg-primary-dark/30 rounded-xl border border-primary/20 dark:border-primary-dark/30">
              <CreditCard className="h-8 w-8 text-primary dark:text-primary-dark" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-text dark:text-text-dark">
                Smart Flashcards
                <Sparkles className="inline h-6 w-6 ml-2 text-accent dark:text-accent-dark" />
              </h1>
              <p className="text-text/70 dark:text-text-dark/70 mt-1">
                AI-powered spaced repetition learning system
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex space-x-4 mb-6">
        <Button
          onClick={() => setActiveTab("decks")}
          variant={activeTab === "decks" ? "default" : "outline"}
          className={
            activeTab === "decks"
              ? "bg-primary dark:bg-primary-dark text-bg dark:text-bg-dark"
              : "border-primary/40 dark:border-primary-dark/50 text-primary dark:text-primary-dark"
          }
        >
          <BookOpen className="h-4 w-4 mr-2" />
          My Decks
        </Button>
        <Button
          onClick={() => setShowCreateForm(true)}
          variant="outline"
          className="border-accent/40 dark:border-accent-dark/50 text-accent dark:text-accent-dark hover:bg-accent/10 dark:hover:bg-accent-dark/10"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Deck
        </Button>
      </div>

      {activeTab === "decks" && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {decksLoading ? (
            <div className="col-span-full flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary dark:text-primary-dark" />
            </div>
          ) : decks.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <CreditCard className="h-16 w-16 mx-auto text-primary/50 dark:text-primary-dark/50 mb-4" />
              <h3 className="text-lg font-medium text-text dark:text-text-dark mb-2">
                No flashcard decks yet
              </h3>
              <p className="text-text/60 dark:text-text-dark/60 mb-4">
                Create your first deck to start learning!
              </p>
              <Button
                onClick={() => setShowCreateForm(true)}
                className="bg-primary dark:bg-primary-dark text-bg dark:text-bg-dark"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create First Deck
              </Button>
            </div>
          ) : (
            decks.map((deck) => (
              <Card
                key={deck._id}
                className="bg-bg dark:bg-bg-dark border-primary/20 dark:border-primary-dark/30 hover:shadow-lg transition-all duration-200"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg text-text dark:text-text-dark">
                        {deck.title}
                      </CardTitle>
                      <Badge className="mt-2 bg-primary/20 dark:bg-primary-dark/30 text-primary dark:text-primary-dark">
                        {deck.subject}
                      </Badge>
                    </div>
                    <Button
                      onClick={() => deleteMutation.mutate(deck._id)}
                      variant="outline"
                      size="sm"
                      className="text-secondary dark:text-secondary-dark hover:bg-secondary/10 dark:hover:bg-secondary-dark/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text/70 dark:text-text-dark/70">
                        Total Cards:
                      </span>
                      <span className="font-medium text-text dark:text-text-dark">
                        {deck.flashcards.length}
                      </span>
                    </div>
                    <Button
                      onClick={() => handleStartStudy(deck._id)}
                      className="w-full bg-accent dark:bg-accent-dark text-bg dark:text-bg-dark hover:bg-accent/90 dark:hover:bg-accent-dark/90"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Study Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {activeTab === "study" && currentDeck && studyCards.length > 0 && (
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-text dark:text-text-dark">
                {currentDeck.title}
              </h2>
              <Badge className="bg-primary/20 dark:bg-primary-dark/30 text-primary dark:text-primary-dark">
                {currentCard + 1} / {studyCards.length}
              </Badge>
            </div>
            <Progress
              value={((currentCard + 1) / studyCards.length) * 100}
              className="h-2 bg-primary/10 dark:bg-primary-dark/20"
            />
          </div>

          <Card className="bg-bg dark:bg-bg-dark border-primary/20 dark:border-primary-dark/30 min-h-[400px]">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <div className="p-4 bg-primary/5 dark:bg-primary-dark/10 rounded-lg border border-primary/20 dark:border-primary-dark/30">
                  <h3 className="text-lg font-medium text-text dark:text-text-dark mb-2">
                    Question
                  </h3>
                  <p className="text-text dark:text-text-dark text-lg leading-relaxed">
                    {studyCards[currentCard]?.question}
                  </p>
                </div>

                {showAnswer && (
                  <div className="p-4 bg-accent/5 dark:bg-accent-dark/10 rounded-lg border border-accent/20 dark:border-accent-dark/30">
                    <h3 className="text-lg font-medium text-text dark:text-text-dark mb-2">
                      Answer
                    </h3>
                    <p className="text-text dark:text-text-dark text-lg leading-relaxed">
                      {studyCards[currentCard]?.answer}
                    </p>
                  </div>
                )}

                {!showAnswer ? (
                  <Button
                    onClick={() => setShowAnswer(true)}
                    className="bg-primary dark:bg-primary-dark text-bg dark:text-bg-dark px-8 py-3"
                  >
                    Show Answer
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <p className="text-text/70 dark:text-text-dark/70">
                      How well did you know this?
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                      {[
                        {
                          level: 1,
                          label: "Again",
                          color: "bg-red-500 hover:bg-red-600",
                          icon: X,
                        },
                        {
                          level: 2,
                          label: "Hard",
                          color: "bg-orange-500 hover:bg-orange-600",
                          icon: Clock,
                        },
                        {
                          level: 3,
                          label: "Good",
                          color: "bg-blue-500 hover:bg-blue-600",
                          icon: Target,
                        },
                        {
                          level: 4,
                          label: "Easy",
                          color: "bg-green-500 hover:bg-green-600",
                          icon: CheckCircle,
                        },
                      ].map((confidence) => (
                        <Button
                          key={confidence.level}
                          onClick={() =>
                            handleConfidenceRating(confidence.level)
                          }
                          disabled={reviewMutation.isPending}
                          className={`${confidence.color} text-white px-6 py-2 flex items-center space-x-2`}
                        >
                          <confidence.icon className="h-4 w-4" />
                          <span>{confidence.label}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="bg-bg dark:bg-bg-dark w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl text-text dark:text-text-dark flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-primary dark:text-primary-dark" />
                  Generate AI Flashcards
                </CardTitle>
                <Button
                  onClick={() => setShowCreateForm(false)}
                  variant="outline"
                  size="sm"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-text dark:text-text-dark mb-2">
                    Deck Title
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="e.g., Biology Chapter 5 - Cell Division"
                    className="border-primary/30 dark:border-primary-dark/40 bg-bg dark:bg-bg-dark"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text dark:text-text-dark mb-2">
                    Subject
                  </label>
                  <Input
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    placeholder="e.g., Biology, Mathematics, Physics"
                    className="border-primary/30 dark:border-primary-dark/40 bg-bg dark:bg-bg-dark"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text dark:text-text-dark mb-2">
                    Content to Learn
                  </label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    placeholder="Paste your notes, textbook content, or any material you want to study..."
                    rows={8}
                    className="border-primary/30 dark:border-primary-dark/40 bg-bg dark:bg-bg-dark"
                  />
                  <p className="text-sm text-text/60 dark:text-text-dark/60 mt-2">
                    AI will analyze this content and create effective flashcards
                    for your study level
                  </p>
                </div>

                <div className="flex justify-end space-x-3">
                  <Button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    variant="outline"
                    className="border-primary/40 dark:border-primary-dark/50"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={
                      generateMutation.isPending ||
                      !formData.title ||
                      !formData.subject ||
                      !formData.content
                    }
                    className="bg-accent dark:bg-accent-dark text-bg dark:text-bg-dark"
                  >
                    {generateMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4 mr-2" />
                        Generate Flashcards
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SmartFlashcards;
