"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SafeRecommendationsPage;
const react_1 = __importDefault(require("react"));
const useRecommendations_1 = require("../../../../../features/safe/recommendations/hooks/useRecommendations");
function SafeRecommendationsPage() {
    const { recommendations, acceptRecommendation, rejectRecommendation } = (0, useRecommendations_1.useRecommendations)();
    // Fallback mock recommendations in case database is loading/empty
    const displayRecommendations = recommendations.length > 0 ? recommendations : [
        { id: "rec-1", title: "Scale Down High CPC Adset", type: "BUDGET_CUT", priority: "HIGH", score: 85, description: "CPA exceeds target boundaries by 42% on Meta Ads." },
        { id: "rec-2", title: "Pause Overlapping Target Audiances", type: "PAUSE", priority: "NORMAL", score: 72, description: "Audience overlap index at 68% causing performance fatigue." },
    ];
    return (<div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">AI Advisor Recommendations</h1>
        <p className="text-muted-foreground">Read-only cost optimizations and performance advisories</p>
      </div>

      <div className="grid gap-4">
        {displayRecommendations.map((rec) => (<div key={rec.id} className="border bg-card rounded-xl p-6 shadow-sm flex flex-col justify-between md:flex-row md:items-center">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded ${rec.priority === "HIGH" || rec.priority === "CRITICAL"
                ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"}`}>
                  {rec.priority}
                </span>
                <span className="text-xs text-muted-foreground">Score: {rec.score}/100</span>
              </div>
              <h3 className="text-lg font-bold">{rec.title}</h3>
              <p className="text-sm text-muted-foreground">{rec.description}</p>
            </div>

            <div className="mt-4 md:mt-0 flex items-center space-x-2">
              <button onClick={() => rejectRecommendation(rec.id)} className="px-3 py-1.5 border rounded-lg text-sm hover:bg-muted text-muted-foreground">
                Dismiss
              </button>
              <button onClick={() => acceptRecommendation(rec.id)} className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold">
                Accept Advice
              </button>
            </div>
          </div>))}
      </div>
    </div>);
}
//# sourceMappingURL=page.js.map