import { useQuery, useMutation } from "@tanstack/react-query";
import {
  userProfileAPI,
  unfollowUserAPI,
} from "../../../APIservices/users/userAPI";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Users,
  UserMinus,
  Crown,
  GraduationCap,
  BookOpen,
  Sparkles,
  Heart,
  Star,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";

const StudentMyFollowing = () => {
  const [unfollowingUser, setUnfollowingUser] = useState(null);

  // Fetch user profile
  const {
    data: profileData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["user-profile"],
    queryFn: userProfileAPI,
  });

  // Unfollow user mutation
  const unfollowMutation = useMutation({
    mutationKey: ["unfollow-user"],
    mutationFn: unfollowUserAPI,
    onMutate: (userId) => {
      setUnfollowingUser(userId);
    },
    onSuccess: () => {
      refetch();
      setUnfollowingUser(null);
    },
    onError: (error) => {
      console.log("Error unfollowing user:", error);
      setUnfollowingUser(null);
    },
  });

  const myFollowing = profileData?.user?.following || [];
  const followingCount = myFollowing.length;

  const handleUnfollow = async (userId) => {
    unfollowMutation.mutateAsync(userId);
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "admin":
        return <Crown className="h-4 w-4" />;
      case "teacher":
        return <GraduationCap className="h-4 w-4" />;
      case "student":
        return <BookOpen className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-accent/20 dark:bg-accent-dark/20 text-accent dark:text-accent-dark border-accent/30 dark:border-accent-dark/30";
      case "teacher":
        return "bg-primary/20 dark:bg-primary-dark/20 text-primary dark:text-primary-dark border-primary/30 dark:border-primary-dark/30";
      case "student":
        return "bg-secondary/20 dark:bg-secondary-dark/20 text-secondary dark:text-secondary-dark border-secondary/30 dark:border-secondary-dark/30";
      default:
        return "bg-primary/20 dark:bg-primary-dark/20 text-primary dark:text-primary-dark border-primary/30 dark:border-primary-dark/30";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 dark:from-primary-dark/10 dark:via-primary-dark/5 dark:to-secondary-dark/10 p-8 rounded-2xl border border-primary/20 dark:border-primary-dark/20">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary/20 dark:bg-primary-dark/20 rounded-xl animate-pulse">
              <Users className="h-8 w-8 text-primary dark:text-primary-dark" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-text dark:text-text-dark">
                Loading Your Following...
              </h1>
              <p className="text-text/70 dark:text-text-dark/70 mt-1">
                Please wait while we fetch your connections
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Alert className="border-secondary/50 dark:border-secondary-dark/50 bg-secondary/5 dark:bg-secondary-dark/5">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="text-secondary dark:text-secondary-dark">
            Error Loading Following List
          </AlertTitle>
          <AlertDescription className="text-text dark:text-text-dark">
            {error?.message ||
              "Something went wrong while fetching your following list."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 dark:from-primary-dark/20 dark:via-primary-dark/10 dark:to-accent-dark/20 p-8 border border-primary/20 dark:border-primary-dark/20">
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 dark:from-primary-dark/20 dark:via-primary-dark/10 dark:to-accent-dark/20"></div>
        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary/20 dark:bg-primary-dark/20 rounded-xl shadow-lg">
                <Users className="h-8 w-8 text-primary dark:text-primary-dark" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-text dark:text-text-dark">
                  My Following
                  <Sparkles className="inline h-6 w-6 ml-2 text-accent dark:text-accent-dark" />
                </h1>
                <p className="text-text/70 dark:text-text-dark/70 mt-1">
                  Connect with educators and fellow learners
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className="bg-primary/30 dark:bg-primary-dark/30 text-primary dark:text-primary-dark px-4 py-2 text-lg font-bold border border-primary/40 dark:border-primary-dark/40">
                {followingCount} Following
              </Badge>
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-bg/70 dark:bg-bg-dark/70 backdrop-blur-sm rounded-xl p-4 border border-primary/20 dark:border-primary-dark/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-accent/20 dark:bg-accent-dark/20 rounded-lg">
                  <Heart className="h-6 w-6 text-accent dark:text-accent-dark" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text dark:text-text-dark">
                    Building Your Network
                  </h3>
                  <p className="text-sm text-text/60 dark:text-text-dark/60">
                    Growing your learning community
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary dark:text-primary-dark">
                  {followingCount}
                </div>
                <div className="text-sm text-text/60 dark:text-text-dark/60">
                  Connections
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Following List */}
      {followingCount === 0 ? (
        <Card className="bg-bg dark:bg-bg-dark border-primary/10 dark:border-primary-dark/10 shadow-lg">
          <CardContent className="p-12 text-center">
            <div className="p-4 bg-primary/10 dark:bg-primary-dark/10 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <Users className="h-10 w-10 text-primary dark:text-primary-dark" />
            </div>
            <h3 className="text-xl font-bold text-text dark:text-text-dark mb-3">
              No Following Yet
            </h3>
            <p className="text-text/60 dark:text-text-dark/60 mb-6 max-w-md mx-auto">
              Start building your learning network by following teachers,
              mentors, and fellow students.
            </p>
            <Button className="bg-primary/80  text-bg dark:text-bg-dark hover:bg-primary dark:hover:bg-secondary-dark">
              <Users className="h-4 w-4 mr-2" />
              Discover People
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myFollowing.map((user) => (
            <Card
              key={user._id}
              className="group bg-bg dark:bg-bg-dark border-primary/10 dark:border-primary-dark/10 shadow-lg hover:shadow-xl transition-all duration-300 ease-out hover:scale-[1.02] overflow-hidden"
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-14 w-14 ring-4 ring-primary/20 dark:ring-primary-dark/20 shadow-lg">
                      <AvatarImage
                        src={user?.profilePicture?.path || user?.profilePicture}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-secondary dark:from-primary-dark dark:to-secondary-dark text-bg dark:text-bg-dark font-bold text-lg">
                        {user?.username?.charAt(0)?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-text dark:text-text-dark group-hover:text-primary dark:group-hover:text-primary-dark transition-colors">
                        {user?.username}
                      </h3>
                      <p className="text-sm text-text/60 dark:text-text-dark/60">
                        {user?.email || "No email provided"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-accent dark:bg-accent-dark rounded-full animate-pulse"></div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-4">
                  {/* Role Badge */}
                  <div className="flex items-center justify-center">
                    <Badge
                      className={`${getRoleColor(
                        user?.role
                      )} px-3 py-1 text-sm font-medium flex items-center space-x-1`}
                    >
                      {getRoleIcon(user?.role)}
                      <span className="capitalize">
                        {user?.role || "Student"}
                      </span>
                    </Badge>
                  </div>

                  {/* User Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-primary/5 dark:bg-primary-dark/5 rounded-lg border border-primary/10 dark:border-primary-dark/10">
                      <div className="text-lg font-bold text-primary dark:text-primary-dark">
                        {user?.posts?.length || 0}
                      </div>
                      <div className="text-xs text-text/60 dark:text-text-dark/60 font-medium">
                        Posts
                      </div>
                    </div>
                    <div className="text-center p-3 bg-secondary/5 dark:bg-secondary-dark/5 rounded-lg border border-secondary/10 dark:border-secondary-dark/10">
                      <div className="text-lg font-bold text-secondary dark:text-secondary-dark">
                        {user?.followers?.length || 0}
                      </div>
                      <div className="text-xs text-text/60 dark:text-text-dark/60 font-medium">
                        Followers
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button
                    onClick={() => handleUnfollow(user._id)}
                    disabled={unfollowingUser === user._id}
                    variant="outline"
                    className="w-full border-secondary/30 dark:border-secondary-dark/30 text-secondary dark:text-secondary-dark hover:bg-secondary dark:hover:bg-secondary-dark hover:text-bg dark:hover:text-bg-dark transition-all duration-300 group-hover:scale-105"
                  >
                    {unfollowingUser === user._id ? (
                      <>
                        <div className="w-4 h-4 border-2 border-secondary/30 border-t-secondary rounded-full animate-spin mr-2"></div>
                        Unfollowing...
                      </>
                    ) : (
                      <>
                        <UserMinus className="h-4 w-4 mr-2" />
                        Unfollow
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Network Stats Summary */}
      {followingCount > 0 && (
        <Card className="bg-gradient-to-br from-accent/5 via-transparent to-primary/5 dark:from-accent-dark/5 dark:to-primary-dark/5 border-accent/20 dark:border-accent-dark/20 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-text dark:text-text-dark flex items-center">
              <Star className="h-6 w-6 mr-2 text-accent dark:text-accent-dark" />
              Network Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-primary/10 dark:bg-primary-dark/10 rounded-xl">
                <GraduationCap className="h-8 w-8 text-primary dark:text-primary-dark mx-auto mb-2" />
                <div className="text-2xl font-bold text-text dark:text-text-dark">
                  {myFollowing.filter((user) => user.role === "teacher").length}
                </div>
                <div className="text-sm text-text/60 dark:text-text-dark/60 font-medium">
                  Teachers
                </div>
              </div>

              <div className="text-center p-4 bg-secondary/10 dark:bg-secondary-dark/10 rounded-xl">
                <BookOpen className="h-8 w-8 text-secondary dark:text-secondary-dark mx-auto mb-2" />
                <div className="text-2xl font-bold text-text dark:text-text-dark">
                  {myFollowing.filter((user) => user.role === "student").length}
                </div>
                <div className="text-sm text-text/60 dark:text-text-dark/60 font-medium">
                  Students
                </div>
              </div>

              <div className="text-center p-4 bg-accent/10 dark:bg-accent-dark/10 rounded-xl">
                <Crown className="h-8 w-8 text-accent dark:text-accent-dark mx-auto mb-2" />
                <div className="text-2xl font-bold text-text dark:text-text-dark">
                  {myFollowing.filter((user) => user.role === "admin").length}
                </div>
                <div className="text-sm text-text/60 dark:text-text-dark/60 font-medium">
                  Admins
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-accent/10 dark:from-primary-dark/10 dark:to-accent-dark/10 rounded-lg border border-primary/20 dark:border-primary-dark/20">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-6 w-6 text-accent dark:text-accent-dark" />
                <div>
                  <h4 className="font-semibold text-text dark:text-text-dark">
                    Growing Your Learning Network
                  </h4>
                  <p className="text-sm text-text/60 dark:text-text-dark/60 mt-1">
                    You're connected with {followingCount} amazing educators and
                    learners. Keep building meaningful connections!
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StudentMyFollowing;
