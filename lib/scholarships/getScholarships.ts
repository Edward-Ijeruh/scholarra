import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import { FirestoreScholarship, Scholarship } from "@/types/scholarship";
import { transformScholarship } from "./transformScholarship";

export async function getActiveScholarships(): Promise<Scholarship[]> {
  const snap = await getDocs(collection(db, "scholarships"));

  return snap.docs.map((doc) =>
    transformScholarship({
      id: doc.id,
      ...(doc.data() as Omit<FirestoreScholarship, "id">),
    }),
  );
}
