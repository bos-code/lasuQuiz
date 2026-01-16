import GoogleIcon from "@mui/icons-material/Google";
type Props = {
  onClick: (provider: "google") => void;
};

const SocialButtons = ({ onClick }: Props) => {
  return (
    <div className="grid grid-cols-1 gap-3">
      <SocialButton label="Continue with Google" icon={<GoogleIcon fontSize="small" />} onClick={() => onClick("google")} />
    </div>
  );
};

const SocialButton = ({
  label,
  icon,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="px-3 py-3 bg-white/5 border border-white/10 rounded-lg hover:border-white/20 hover:bg-white/10 transition-colors flex items-center justify-center gap-2 text-sm font-semibold text-white"
  >
    {icon}
    <span>{label}</span>
  </button>
);

export default SocialButtons;
