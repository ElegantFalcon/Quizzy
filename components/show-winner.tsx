import { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function ShowWinnerComponent({ code }: { code: string }) {
  type Participant = { name: string; points: number };

  const [winner, setWinner] = useState<Participant | null>(null);

  useEffect(() => {
    // Find quizDocId from room code
    const fetchWinner = async () => {
      const quizQ = query(collection(db, "created-quiz"), where("roomCode", "==", code));
      const quizSnap = await getDocs(quizQ);
      if (!quizSnap.empty) {
        const quizDocId = quizSnap.docs[0].id;
        const rtdb = getDatabase();
        const leaderboardRef = ref(rtdb, `leaderboards/${quizDocId}/participants`);
        onValue(leaderboardRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const arr: Participant[] = Object.values(data);
            arr.sort((a, b) => b.points - a.points);
            setWinner(arr[0]);
          }
        });
      }
    };
    fetchWinner();
  }, [code]);

  if (!winner) return <div>Loading winner...</div>;
  return (
    <div>
      <div className="text-xl font-bold mb-2">Winner:</div>
      <div className="text-2xl">{winner.name}</div>
      <div className="text-lg text-muted-foreground">Points: {winner.points}</div>
    </div>
  );
}