
import OrnateRing from "./OrnateRing";

interface DefaultRingProps {
  animate?: boolean;
}

const DefaultRing = ({ animate = true }: DefaultRingProps) => {
  return <OrnateRing animate={animate} />;
};

export default DefaultRing;
