import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRefProfiles } from "../../app/slices/refereeSlice";
import { fetchFixturePredictions } from "../../app/slices/matchSlice";

export default function AppInitializer() {
  const dispatch = useDispatch();
  const initialized = useRef(false);

  const referees = useSelector((state) => state.referee.list);
  const fixtures = useSelector((state) => state.match.list);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    if (!referees || referees.length === 0) {
      dispatch(fetchRefProfiles());
    }
    if (!fixtures || fixtures.length === 0) {
      dispatch(fetchFixturePredictions());
    }
  }, []);

  return null;
}