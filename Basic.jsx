import React, { useState, useEffect, useRef } from 'react';

const HanjaQuiz = () => {
  const hanjaData = [
    { hanja: '家', hun: '집', eum: '가' },
    { hanja: '間', hun: '사이', eum: '간' },
    { hanja: '江', hun: '강', eum: '강' },
    { hanja: '車', hun: '수레', eum: '거, 차' },
    { hanja: '工', hun: '장인', eum: '공' },
    { hanja: '空', hun: '빌', eum: '공' },
    { hanja: '氣', hun: '기운', eum: '기' },
    { hanja: '記', hun: '기록할', eum: '기' },
    { hanja: '男', hun: '사내', eum: '남' },
    { hanja: '內', hun: '안', eum: '내' },
    { hanja: '農', hun: '농사', eum: '농' },
    { hanja: '答', hun: '대답', eum: '답' },
    { hanja: '道', hun: '길', eum: '도' },
    { hanja: '動', hun: '움직일', eum: '동' },
    { hanja: '力', hun: '힘', eum: '력' },
    { hanja: '立', hun: '설', eum: '립' },
    { hanja: '每', hun: '매양', eum: '매' },
    { hanja: '名', hun: '이름', eum: '명' },
    { hanja: '物', hun: '물건', eum: '물' },
    { hanja: '方', hun: '모', eum: '방' },
    { hanja: '不', hun: '아닐', eum: '불' },
    { hanja: '事', hun: '일', eum: '사' },
    { hanja: '上', hun: '윗', eum: '상' },
    { hanja: '姓', hun: '성', eum: '성' },
    { hanja: '世', hun: '인간', eum: '세' },
    { hanja: '手', hun: '손', eum: '수' },
    { hanja: '時', hun: '때', eum: '시' },
    { hanja: '市', hun: '저자', eum: '시' },
    { hanja: '食', hun: '먹을', eum: '식' },
    { hanja: '安', hun: '편안', eum: '안' },
    { hanja: '午', hun: '낮', eum: '오' },
    { hanja: '右', hun: '오른쪽', eum: '우' },
    { hanja: '子', hun: '아들', eum: '자' },
    { hanja: '自', hun: '스스로', eum: '자' },
    { hanja: '場', hun: '마당', eum: '장' },
    { hanja: '電', hun: '번개', eum: '전' },
    { hanja: '前', hun: '앞', eum: '전' },
    { hanja: '全', hun: '온전', eum: '전' },
    { hanja: '正', hun: '바를', eum: '정' },
    { hanja: '足', hun: '발', eum: '족' },
    { hanja: '左', hun: '왼', eum: '좌' },
    { hanja: '直', hun: '곧을', eum: '직' },
    { hanja: '平', hun: '평평할', eum: '평' },
    { hanja: '下', hun: '아래', eum: '하' },
    { hanja: '漢', hun: '한나라', eum: '한' },
    { hanja: '海', hun: '바다', eum: '해' },
    { hanja: '話', hun: '말씀', eum: '화' },
    { hanja: '活', hun: '살', eum: '활' },
    { hanja: '孝', hun: '효도', eum: '효' },
    { hanja: '後', hun: '뒤', eum: '후' }
  ];

  const [gameMode, setGameMode] = useState('menu');
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [wrongQuestions, setWrongQuestions] = useState([]);
  const [badges, setBadges] = useState([]);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [statistics, setStatistics] = useState(null);
  const timerRef = useRef(null);

  // localStorage에서 통계 불러오기
  useEffect(() => {
    const savedStats = localStorage.getItem('hanjaQuizStats');
    if (savedStats) {
      setStatistics(JSON.parse(savedStats));
    } else {
      const initialStats = {
        totalGames: 0,
        totalQuestions: 0,
        totalCorrect: 0,
        bestScore: 0,
        bestStreak: 0,
        hanjaStats: {}
      };
      hanjaData.forEach(h => {
        initialStats.hanjaStats[h.hanja] = { correct: 0, wrong: 0, total: 0 };
      });
      setStatistics(initialStats);
      localStorage.setItem('hanjaQuizStats', JSON.stringify(initialStats));
    }
  }, []);

  // 타이머 효과
  useEffect(() => {
    if (isTimerActive && timeLeft > 0 && !showFeedback) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && !showFeedback) {
      handleTimeOut();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timeLeft, isTimerActive, showFeedback]);

  const handleTimeOut = () => {
    setIsCorrect(false);
    setShowFeedback(true);
    setStreak(0);
    setIsTimerActive(false);
    
    const currentQ = questions[currentQuestion];
    if (!wrongQuestions.find(q => q.hanja === currentQ.originalData.hanja)) {
      setWrongQuestions([...wrongQuestions, currentQ.originalData]);
    }
    
    updateHanjaStats(currentQ.originalData.hanja, false);
  };

  const updateHanjaStats = (hanja, isCorrect) => {
    if (!statistics) return;
    
    const newStats = { ...statistics };
    if (!newStats.hanjaStats[hanja]) {
      newStats.hanjaStats[hanja] = { correct: 0, wrong: 0, total: 0 };
    }
    
    newStats.hanjaStats[hanja].total += 1;
    if (isCorrect) {
      newStats.hanjaStats[hanja].correct += 1;
      newStats.totalCorrect += 1;
    } else {
      newStats.hanjaStats[hanja].wrong += 1;
    }
    newStats.totalQuestions += 1;
    
    setStatistics(newStats);
    localStorage.setItem('hanjaQuizStats', JSON.stringify(newStats));
  };

  const saveGameStats = (finalScore, finalMaxStreak) => {
    if (!statistics) return;
    
    const newStats = { ...statistics };
    newStats.totalGames += 1;
    if (finalScore > newStats.bestScore) {
      newStats.bestScore = finalScore;
    }
    if (finalMaxStreak > newStats.bestStreak) {
      newStats.bestStreak = finalMaxStreak;
    }
    
    setStatistics(newStats);
    localStorage.setItem('hanjaQuizStats', JSON.stringify(newStats));
  };

  const generateQuestions = (reviewMode = false) => {
    let dataToUse = reviewMode && wrongQuestions.length > 0 ? wrongQuestions : hanjaData;
    
    const shuffled = [...dataToUse].sort(() => Math.random() - 0.5);
    
    const generatedQuestions = shuffled.map((item) => {
      const questionType = Math.random() > 0.5 ? 'hanjaToHunEum' : 'hunEumToHanja';
      
      let wrongAnswers = hanjaData
        .filter(h => h.hanja !== item.hanja)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      
      let options;
      if (questionType === 'hanjaToHunEum') {
        options = [
          { text: `${item.hun} ${item.eum}`, isCorrect: true },
          ...wrongAnswers.map(w => ({ text: `${w.hun} ${w.eum}`, isCorrect: false }))
        ].sort(() => Math.random() - 0.5);
        
        return {
          question: `'${item.hanja}' 의 음훈은?`,
          options,
          correctAnswer: `${item.hun} ${item.eum}`,
          hanja: item.hanja,
          originalData: item
        };
      } else {
        options = [
          { text: item.hanja, isCorrect: true },
          ...wrongAnswers.map(w => ({ text: w.hanja, isCorrect: false }))
        ].sort(() => Math.random() - 0.5);
        
        return {
          question: `'${item.hun} ${item.eum}' 의 한자는?`,
          options,
          correctAnswer: item.hanja,
          hunEum: `${item.hun} ${item.eum}`,
          originalData: item
        };
      }
    });
    
    setQuestions(generatedQuestions);
  };

  const checkBadges = (currentScore, total, currentStreak) => {
    const newBadges = [];
    const percentage = (currentScore / total) * 100;
    
    if (percentage === 100) newBadges.push({ name: '완벽주의자', emoji: '🏆', desc: '100점 달성!' });
    if (percentage >= 90) newBadges.push({ name: '한자박사', emoji: '🎓', desc: '90점 이상!' });
    if (currentStreak >= 10) newBadges.push({ name: '연속득점왕', emoji: '🔥', desc: '10연속 정답!' });
    if (currentStreak >= 5) newBadges.push({ name: '스트릭마스터', emoji: '⚡', desc: '5연속 정답!' });
    if (total >= 50) newBadges.push({ name: '도전자', emoji: '💪', desc: '50문제 도전!' });
    
    return newBadges;
  };

  const handleAnswerClick = (option) => {
    if (showFeedback) return;
    
    setIsTimerActive(false);
    setSelectedAnswer(option.text);
    setIsCorrect(option.isCorrect);
    setShowFeedback(true);
    
    const currentQ = questions[currentQuestion];
    
    if (option.isCorrect) {
      setScore(score + 1);
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) {
        setMaxStreak(newStreak);
      }
      updateHanjaStats(currentQ.originalData.hanja, true);
    } else {
      setStreak(0);
      if (!wrongQuestions.find(q => q.hanja === currentQ.originalData.hanja)) {
        setWrongQuestions([...wrongQuestions, currentQ.originalData]);
      }
      updateHanjaStats(currentQ.originalData.hanja, false);
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setShowFeedback(false);
    setIsCorrect(false);
    
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setTimeLeft(10);
      setIsTimerActive(true);
    } else {
      const finalScore = score + (isCorrect ? 1 : 0);
      const earnedBadges = checkBadges(finalScore, questions.length, maxStreak);
      setBadges(earnedBadges);
      saveGameStats(finalScore, maxStreak);
      setGameMode('result');
    }
  };

  const handleStartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setIsCorrect(false);
    setStreak(0);
    setMaxStreak(0);
    setTimeLeft(10);
    generateQuestions(false);
    setGameMode('quiz');
    setIsTimerActive(true);
  };

  const handleStartReview = () => {
    if (wrongQuestions.length === 0) return;
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setIsCorrect(false);
    setStreak(0);
    setTimeLeft(10);
    generateQuestions(true);
    setGameMode('review');
    setIsTimerActive(true);
  };

  const handleBackToMenu = () => {
    setGameMode('menu');
    setQuestions([]);
    setIsTimerActive(false);
  };

  const handleViewStats = () => {
    setGameMode('stats');
  };

  const handleResetStats = () => {
    if (window.confirm('정말로 모든 학습 기록을 초기화하시겠습니까?')) {
      const initialStats = {
        totalGames: 0,
        totalQuestions: 0,
        totalCorrect: 0,
        bestScore: 0,
        bestStreak: 0,
        hanjaStats: {}
      };
      hanjaData.forEach(h => {
        initialStats.hanjaStats[h.hanja] = { correct: 0, wrong: 0, total: 0 };
      });
      setStatistics(initialStats);
      localStorage.setItem('hanjaQuizStats', JSON.stringify(initialStats));
      setWrongQuestions([]);
    }
  };

  // 메뉴 화면
  if (gameMode === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-2xl w-full">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-indigo-600 mb-2">한태희의 도전!</h1>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">한자 맞추기 ⚡</h2>
            <p className="text-gray-600 mb-1">50개 한자 · 문제당 10초 제한</p>
            <p className="text-sm text-orange-600 font-semibold">⏱️ 시간 내에 정답을 맞춰보세요!</p>
          </div>

          {statistics && (
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 mb-4">
              <div className="text-center mb-2">
                <div className="text-sm font-bold text-indigo-700">📊 누적 기록</div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-white rounded-lg p-2">
                  <div className="text-gray-600 text-xs">총 게임</div>
                  <div className="text-lg font-bold text-indigo-600">{statistics.totalGames}회</div>
                </div>
                <div className="bg-white rounded-lg p-2">
                  <div className="text-gray-600 text-xs">최고 점수</div>
                  <div className="text-lg font-bold text-green-600">{statistics.bestScore}점</div>
                </div>
                <div className="bg-white rounded-lg p-2">
                  <div className="text-gray-600 text-xs">총 정답률</div>
                  <div className="text-lg font-bold text-blue-600">
                    {statistics.totalQuestions > 0 
                      ? ((statistics.totalCorrect / statistics.totalQuestions) * 100).toFixed(1) 
                      : 0}%
                  </div>
                </div>
                <div className="bg-white rounded-lg p-2">
                  <div className="text-gray-600 text-xs">최고 연속</div>
                  <div className="text-lg font-bold text-orange-600">{statistics.bestStreak}🔥</div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3 mb-4">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-4 text-white cursor-pointer hover:shadow-lg transition-all" 
              onClick={handleStartQuiz}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xl font-bold">⚡ 퀴즈 시작</div>
                  <div className="text-sm opacity-90">50개 한자 랜덤 출제</div>
                </div>
                <div className="text-3xl">→</div>
              </div>
            </div>

            {wrongQuestions.length > 0 && (
              <div 
                className="bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl p-4 text-white cursor-pointer hover:shadow-lg transition-all" 
                onClick={handleStartReview}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xl font-bold">📚 복습 모드</div>
                    <div className="text-sm opacity-90">틀린 {wrongQuestions.length}개 문제 다시 풀기</div>
                  </div>
                  <div className="text-3xl">→</div>
                </div>
              </div>
            )}

            <div 
              className="bg-gradient-to-r from-green-400 to-teal-500 rounded-xl p-4 text-white cursor-pointer hover:shadow-lg transition-all" 
              onClick={handleViewStats}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xl font-bold">📈 학습 통계</div>
                  <div className="text-sm opacity-90">한자별 정답률 및 약점 분석</div>
                </div>
                <div className="text-3xl">→</div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={handleResetStats}
              className="text-sm text-gray-500 hover:text-red-600 transition-colors"
            >
              🗑️ 기록 초기화
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 통계 화면
  if (gameMode === 'stats') {
    if (!statistics) return null;

    const hanjaWithStats = hanjaData.map(h => ({
      ...h,
      stats: statistics.hanjaStats[h.hanja] || { correct: 0, wrong: 0, total: 0 },
      accuracy: statistics.hanjaStats[h.hanja]?.total > 0 
        ? (statistics.hanjaStats[h.hanja].correct / statistics.hanjaStats[h.hanja].total) * 100 
        : 0
    }));

    const weakHanja = hanjaWithStats
      .filter(h => h.stats.total >= 3)
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 10);

    const strongHanja = hanjaWithStats
      .filter(h => h.stats.total >= 3)
      .sort((a, b) => b.accuracy - a.accuracy)
      .slice(0, 10);

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-indigo-600">📈 학습 통계</h2>
            <button
              onClick={handleBackToMenu}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              ← 메뉴로
            </button>
          </div>

          {/* 전체 통계 */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 mb-4">
            <h3 className="text-lg font-bold text-gray-800 mb-3">🎯 전체 학습 현황</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-white rounded-lg p-3 text-center">
                <div className="text-sm text-gray-600">총 게임 수</div>
                <div className="text-2xl font-bold text-indigo-600">{statistics.totalGames}</div>
              </div>
              <div className="bg-white rounded-lg p-3 text-center">
                <div className="text-sm text-gray-600">풀어본 문제</div>
                <div className="text-2xl font-bold text-blue-600">{statistics.totalQuestions}</div>
              </div>
              <div className="bg-white rounded-lg p-3 text-center">
                <div className="text-sm text-gray-600">전체 정답률</div>
                <div className="text-2xl font-bold text-green-600">
                  {statistics.totalQuestions > 0 
                    ? ((statistics.totalCorrect / statistics.totalQuestions) * 100).toFixed(1) 
                    : 0}%
                </div>
              </div>
              <div className="bg-white rounded-lg p-3 text-center">
                <div className="text-sm text-gray-600">최고 연속</div>
                <div className="text-2xl font-bold text-orange-600">{statistics.bestStreak}🔥</div>
              </div>
            </div>
          </div>

          {/* 약점 한자 */}
          <div className="bg-red-50 rounded-xl p-4 mb-4">
            <h3 className="text-lg font-bold text-red-700 mb-3">⚠️ 약점 한자 TOP 10</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {weakHanja.length > 0 ? (
                weakHanja.map((h, idx) => (
                  <div key={idx} className="bg-white rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl font-bold text-gray-800">{h.hanja}</div>
                      <div className="text-sm text-gray-600">{h.hun} {h.eum}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-xs text-gray-500">
                        {h.stats.correct}/{h.stats.total}
                      </div>
                      <div className={`font-bold ${h.accuracy < 50 ? 'text-red-600' : 'text-orange-600'}`}>
                        {h.accuracy.toFixed(0)}%
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-4">아직 충분한 데이터가 없습니다 (최소 3회 출제)</div>
              )}
            </div>
          </div>

          {/* 강점 한자 */}
          <div className="bg-green-50 rounded-xl p-4">
            <h3 className="text-lg font-bold text-green-700 mb-3">✨ 강점 한자 TOP 10</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {strongHanja.length > 0 ? (
                strongHanja.map((h, idx) => (
                  <div key={idx} className="bg-white rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl font-bold text-gray-800">{h.hanja}</div>
                      <div className="text-sm text-gray-600">{h.hun} {h.eum}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-xs text-gray-500">
                        {h.stats.correct}/{h.stats.total}
                      </div>
                      <div className="font-bold text-green-600">
                        {h.accuracy.toFixed(0)}%
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-4">아직 충분한 데이터가 없습니다 (최소 3회 출제)</div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 결과 화면
  if (gameMode === 'result') {
    const percentage = ((score / questions.length) * 100).toFixed(1);
    let message = '';
    let emoji = '';
    
    if (percentage >= 90) {
      message = '완벽해요! 한자 박사님이세요! 🎓';
      emoji = '🏆';
    } else if (percentage >= 70) {
      message = '대단해요! 정말 잘하셨어요! 👏';
      emoji = '🌟';
    } else if (percentage >= 50) {
      message = '잘했어요! 조금만 더 연습하면 완벽할 거예요! 💪';
      emoji = '🎯';
    } else {
      message = '괜찮아요! 다시 도전해봐요! 화이팅! 🔥';
      emoji = '📚';
    }
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-2xl w-full">
          <div className="text-center">
            <div className="text-5xl mb-3">{emoji}</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">퀴즈 완료!</h2>
            <div className="text-5xl font-bold text-indigo-600 mb-1">{score}/{questions.length}</div>
            <div className="text-xl text-gray-600 mb-3">{percentage}점</div>
            <p className="text-lg text-gray-700 mb-4">{message}</p>
            
            {badges.length > 0 && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 mb-4">
                <div className="text-lg font-bold text-gray-800 mb-2">🎖️ 획득한 배지</div>
                <div className="flex flex-wrap justify-center gap-2">
                  {badges.map((badge, idx) => (
                    <div key={idx} className="bg-white rounded-lg px-3 py-2 shadow-md">
                      <div className="text-2xl">{badge.emoji}</div>
                      <div className="text-xs font-semibold text-gray-700">{badge.name}</div>
                      <div className="text-xs text-gray-500">{badge.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-green-100 rounded-lg p-3">
                  <div className="text-green-700 text-sm font-semibold">정답</div>
                  <div className="text-xl font-bold text-green-800">{score}</div>
                </div>
                <div className="bg-red-100 rounded-lg p-3">
                  <div className="text-red-700 text-sm font-semibold">오답</div>
                  <div className="text-xl font-bold text-red-800">{questions.length - score}</div>
                </div>
                <div className="bg-orange-100 rounded-lg p-3">
                  <div className="text-orange-700 text-sm font-semibold">최고 연속</div>
                  <div className="text-xl font-bold text-orange-800">{maxStreak}🔥</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <button
                onClick={handleBackToMenu}
                className="w-full bg-indigo-600 text-white px-6 py-3 rounded-xl text-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg"
              >
                메인 메뉴로 🏠
              </button>
              
              {wrongQuestions.length > 0 && (
                <button
                  onClick={handleStartReview}
                  className="w-full bg-purple-600 text-white px-6 py-3 rounded-xl text-lg font-semibold hover:bg-purple-700 transition-colors shadow-lg"
                >
                  틀린 문제 복습하기 📚 ({wrongQuestions.length}개)
                </button>
              )}
              
              <button
                onClick={handleViewStats}
                className="w-full bg-green-600 text-white px-6 py-3 rounded-xl text-lg font-semibold hover:bg-green-700 transition-colors shadow-lg"
              >
                학습 통계 보기 📈
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-2xl text-gray-700">퀴즈 준비 중...</div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const modeLabel = gameMode === 'review' ? '📚 복습 모드' : '⚡ 퀴즈 모드';
  const timerColor = timeLeft <= 3 ? 'text-red-600' : timeLeft <= 5 ? 'text-orange-600' : 'text-green-600';
  const progressPercent = (timeLeft / 10) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-5 max-w-3xl w-full">
        {/* Header */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h1 className="text-2xl font-bold text-indigo-600">한태희의 한자 퀴즈</h1>
              <div className="text-sm text-gray-600">{modeLabel}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">점수</div>
              <div className="text-2xl font-bold text-indigo-600">{score}/{questions.length}</div>
              {streak > 0 && (
                <div className="text-sm font-bold text-orange-600">🔥 {streak}연속</div>
              )}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="relative mb-2">
            <div className="flex mb-1 items-center justify-between text-xs">
              <span className="font-semibold text-gray-700">문제 {currentQuestion + 1} / {questions.length}</span>
              <span className="font-semibold text-gray-700">{((currentQuestion / questions.length) * 100).toFixed(0)}%</span>
            </div>
            <div className="overflow-hidden h-2 flex rounded-full bg-indigo-100">
              <div
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600 transition-all duration-500"
              />
            </div>
          </div>

          {/* Timer */}
          {!showFeedback && (
            <div className="bg-gray-50 rounded-lg p-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-600">남은 시간</span>
                <span className={`text-2xl font-bold ${timerColor}`}>⏱️ {timeLeft}초</span>
              </div>
              <div className="overflow-hidden h-2 flex rounded-full bg-gray-200">
                <div
                  style={{ width: `${progressPercent}%` }}
                  className={`transition-all duration-1000 ${
                    timeLeft <= 3 ? 'bg-red-500' : timeLeft <= 5 ? 'bg-orange-500' : 'bg-green-500'
                  }`}
                />
              </div>
            </div>
          )}
        </div>

        {/* Question */}
        <div className="mb-4">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-center shadow-lg">
            <h2 className="text-3xl font-bold text-white">{currentQ.question}</h2>
          </div>
        </div>

        {/* Options - 2x2 Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {currentQ.options.map((option, index) => {
            let buttonClass = "w-full p-4 text-lg font-semibold rounded-xl transition-all duration-200 border-2 ";
            
            if (!showFeedback) {
              buttonClass += "bg-white border-gray-300 hover:border-indigo-500 hover:bg-indigo-50 text-gray-800";
            } else if (option.isCorrect) {
              buttonClass += "bg-green-500 border-green-600 text-white shadow-lg scale-105";
            } else if (selectedAnswer === option.text) {
              buttonClass += "bg-red-500 border-red-600 text-white shadow-lg";
            } else {
              buttonClass += "bg-gray-200 border-gray-300 text-gray-500 cursor-not-allowed";
            }
            
            return (
              <button
                key={index}
                onClick={() => handleAnswerClick(option)}
                disabled={showFeedback}
                className={buttonClass}
              >
                <div className="flex items-center justify-center gap-2">
                  <span className="break-all">{option.text}</span>
                  {showFeedback && option.isCorrect && <span className="text-2xl">✓</span>}
                  {showFeedback && selectedAnswer === option.text && !option.isCorrect && <span className="text-2xl">✗</span>}
                </div>
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div className="mb-3">
            <div className={`rounded-xl p-4 ${isCorrect ? 'bg-green-50 border-2 border-green-300' : 'bg-red-50 border-2 border-red-300'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-2xl mr-2">{isCorrect ? '🎉' : (timeLeft === 0 ? '⏰' : '💪')}</span>
                  <div>
                    <div className={`text-lg font-bold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                      {isCorrect ? '정답입니다!' : timeLeft === 0 ? '시간 초과!' : '아쉬워요!'}
                    </div>
                    {!isCorrect && (
                      <div className="text-gray-700 text-sm">
                        정답: <span className="font-bold text-green-700">{currentQ.correctAnswer}</span>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleNextQuestion}
                  className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-md"
                >
                  {currentQuestion + 1 < questions.length ? '다음 →' : '결과 보기'}
                </button>
              </div>
            </div>
          </div>
        )}

        {!showFeedback && (
          <div className="text-center text-gray-500 text-xs">
            ⚡ 10초 안에 정답을 선택하세요!
          </div>
        )}
      </div>
    </div>
  );
};

export default HanjaQuiz;