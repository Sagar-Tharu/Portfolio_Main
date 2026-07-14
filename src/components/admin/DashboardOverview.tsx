import { usePortfolio } from '@/context/PortfolioContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Briefcase, 
  GraduationCap, 
  Award, 
  Trophy, 
  Code2,
  TrendingUp,
  CheckCircle2,
  Clock
} from 'lucide-react';

export function DashboardOverview() {
  const { data } = usePortfolio();

  const stats = [
    { 
      label: 'Projects', 
      value: data.projects.length, 
      icon: Briefcase,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      featured: data.projects.filter(p => p.featured).length 
    },
    { 
      label: 'Experience', 
      value: data.experience.length, 
      icon: TrendingUp,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10'
    },
    { 
      label: 'Education', 
      value: data.education.length, 
      icon: GraduationCap,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10'
    },
    { 
      label: 'Certifications', 
      value: data.certifications.length, 
      icon: Award,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10'
    },
    { 
      label: 'Achievements', 
      value: data.achievements.length, 
      icon: Trophy,
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/10'
    },
    { 
      label: 'Skills', 
      value: data.skills.programming.length + data.skills.frontend.length + data.skills.backend.length + data.skills.tools.length, 
      icon: Code2,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10'
    },
  ];

  const recentActivity = [
    { action: 'Portfolio data updated', time: 'Just now', icon: CheckCircle2 },
    { action: 'Project added', time: '2 hours ago', icon: Briefcase },
    { action: 'Skills updated', time: '1 day ago', icon: Code2 },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-slate-400">Overview of your portfolio content</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="bg-white dark:bg-slate-800/50 border-gray-200 dark:border-slate-700">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-gray-600 dark:text-slate-400 text-xs sm:text-sm truncate">{stat.label}</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                  {'featured' in stat && stat.featured !== undefined && (
                    <p className="text-xs text-gray-500 dark:text-slate-500 mt-1">
                      {stat.featured} featured
                    </p>
                  )}
                </div>
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg ${stat.bgColor} flex items-center justify-center flex-shrink-0`}>
                  <stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Info */}
      <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
        {/* Personal Info Summary */}
        <Card className="bg-white dark:bg-slate-800/50 border-gray-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white text-base sm:text-lg">Personal Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 sm:space-y-3">
            <div className="flex justify-between gap-2">
              <span className="text-gray-600 dark:text-slate-400 text-sm">Name</span>
              <span className="text-gray-900 dark:text-white text-sm font-medium truncate">{data.personal.name}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-gray-600 dark:text-slate-400 text-sm">Title</span>
              <span className="text-gray-900 dark:text-white text-sm font-medium truncate">{data.personal.title}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-gray-600 dark:text-slate-400 text-sm">Location</span>
              <span className="text-gray-900 dark:text-white text-sm font-medium truncate">{data.personal.location}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-gray-600 dark:text-slate-400 text-sm">Email</span>
              <span className="text-gray-900 dark:text-white text-sm font-medium truncate">{data.personal.email}</span>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-white dark:bg-slate-800/50 border-gray-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white text-base sm:text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                    <activity.icon className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 dark:text-white text-sm truncate">{activity.action}</p>
                    <p className="text-gray-500 dark:text-slate-500 text-xs flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Tips */}
      <Card className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border-indigo-500/30 dark:border-indigo-500/30">
        <CardContent className="p-4 sm:p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm sm:text-base">💡 Quick Tips</h3>
          <ul className="text-gray-700 dark:text-slate-300 text-xs sm:text-sm space-y-1">
            <li>• Use the menu to navigate between sections</li>
            <li>• Export data to download your configuration</li>
            <li>• Preview your changes before publishing</li>
            <li>• All changes are saved automatically</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
