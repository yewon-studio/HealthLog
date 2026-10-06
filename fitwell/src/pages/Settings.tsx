import { useRef, useState } from 'react';
import { exportBackup, parseBackupText } from '../services/backupService';
import { useAppStore } from '../store/AppStore';
import {
  WATER_GOAL_MAX,
  WATER_GOAL_MIN,
  WATER_GOAL_PRESETS,
  WATER_GOAL_STEP,
  WEEKLY_GOAL_MAX,
  WEEKLY_GOAL_MIN,
  WEEKLY_GOAL_PRESETS,
} from '../types/user';

export function SettingsPage() {
  const { data, updateWaterGoal, updateWeeklyWorkoutGoal, replaceData } = useAppStore();
  const { waterGoal, weeklyWorkoutGoal } = data.user;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [backupMessage, setBackupMessage] = useState('');

  return (
    <section className="page-intro">
      <p className="date-kicker">Settings</p>
      <h1 className="greeting">설정</h1>
      <div className="stack">
        <section className="card">
          <p className="card-label">하루 물 목표</p>
          <div className="goal-row">
            <button
              className="stepper minus"
              type="button"
              aria-label="물 목표 250ml 감소"
              disabled={waterGoal <= WATER_GOAL_MIN}
              onClick={() => updateWaterGoal(waterGoal - WATER_GOAL_STEP)}
            >
              −
            </button>
            <div className="goal-value">
              {waterGoal.toLocaleString('ko-KR')}
              <span>ml</span>
            </div>
            <button
              className="stepper"
              type="button"
              aria-label="물 목표 250ml 증가"
              disabled={waterGoal >= WATER_GOAL_MAX}
              onClick={() => updateWaterGoal(waterGoal + WATER_GOAL_STEP)}
            >
              +
            </button>
          </div>
          <div className="chips">
            {WATER_GOAL_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                className={`chip${waterGoal === preset ? ' active' : ''}`}
                onClick={() => updateWaterGoal(preset)}
              >
                {preset.toLocaleString('ko-KR')}ml
              </button>
            ))}
          </div>
        </section>

        <section className="card">
          <p className="card-label">주간 운동 목표</p>
          <div className="goal-row">
            <button
              className="stepper minus"
              type="button"
              aria-label="주간 운동 목표 1회 감소"
              disabled={weeklyWorkoutGoal <= WEEKLY_GOAL_MIN}
              onClick={() => updateWeeklyWorkoutGoal(weeklyWorkoutGoal - 1)}
            >
              −
            </button>
            <div className="goal-value">
              {weeklyWorkoutGoal}
              <span>회</span>
            </div>
            <button
              className="stepper"
              type="button"
              aria-label="주간 운동 목표 1회 증가"
              disabled={weeklyWorkoutGoal >= WEEKLY_GOAL_MAX}
              onClick={() => updateWeeklyWorkoutGoal(weeklyWorkoutGoal + 1)}
            >
              +
            </button>
          </div>
          <div className="chips">
            {WEEKLY_GOAL_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                className={`chip${weeklyWorkoutGoal === preset ? ' active' : ''}`}
                onClick={() => updateWeeklyWorkoutGoal(preset)}
              >
                {preset}회
              </button>
            ))}
          </div>
          <p className="empty">홈의 주간 목표 바와 물 Progress에 바로 반영됩니다.</p>
        </section>

        <section className="card">
          <p className="card-label">기록 백업</p>
          <p className="empty">웹과 앱 사이는 JSON 파일로 주고받을 수 있습니다.</p>
          <div className="chips">
            <button
              className="chip"
              type="button"
              onClick={() => {
                void exportBackup(data)
                  .then((mode) => {
                    setBackupMessage(
                      mode === 'share' ? '기록 파일을 보냈습니다.' : '기록 파일을 저장했습니다.',
                    );
                  })
                  .catch(() => {
                    setBackupMessage('내보내기에 실패했습니다.');
                  });
              }}
            >
              내보내기
            </button>
            <button
              className="chip"
              type="button"
              onClick={() => fileInputRef.current?.click()}
            >
              가져오기
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = '';
              if (!file) return;
              void file.text().then((text) => {
                try {
                  replaceData(parseBackupText(text));
                  setBackupMessage('기록을 가져왔습니다.');
                } catch (error) {
                  setBackupMessage(
                    error instanceof Error ? error.message : '가져오기에 실패했습니다.',
                  );
                }
              });
            }}
          />
          {backupMessage ? <p className="empty">{backupMessage}</p> : null}
        </section>
      </div>
    </section>
  );
}
