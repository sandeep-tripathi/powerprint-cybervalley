
import Panda3D from "./Panda3D";

interface DefaultRingProps {
  animate?: boolean;
}

const DefaultRing = ({ animate = true }: DefaultRingProps) => {
  return <Panda3D animate={animate} />;
};

export default DefaultRing;
