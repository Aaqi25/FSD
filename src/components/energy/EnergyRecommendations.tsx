import React from 'react';
import { Sparkles, TrendingDown, CheckCircle, ArrowRight } from 'lucide-react';
import { EnergyRecommendation } from '../../types';
import { Button } from '../common/Button';

export interface EnergyRecommendationsProps {
  recommendations: EnergyRecommendation[];
  onApplyRecommendation: (rec: EnergyRecommendation) => void;
}

export const EnergyRecommendations: React.FC<EnergyRecommendationsProps> = ({
  recommendations,
  onApplyRecommendation,
}) => {
  return (
    <div className="bg-white rounded-lg border border-slate-200/90 shadow-xs p-5">
      <div className="pb-3 mb-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Energy Efficiency Recommendations
            </h3>
            <p className="text-xs text-slate-500">
              Rule-based analytics targeting reduced peak tariff exposure
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((rec) => {
          const dollarSavings = (rec.estimatedSavingsKwhMonth * 0.16).toFixed(2);

          return (
            <div
              key={rec._id}
              className="p-4 rounded-md border border-slate-200 bg-slate-50/50 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h4 className="text-xs font-bold text-slate-900">{rec.title}</h4>
                  <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                    Save ~{rec.estimatedSavingsKwhMonth} kWh/mo (${dollarSavings})
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{rec.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/70 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-medium capitalize">
                  Impact: {rec.impact}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                  onClick={() => onApplyRecommendation(rec)}
                >
                  Apply Optimization
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
