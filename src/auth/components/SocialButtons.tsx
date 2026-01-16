import GoogleIcon from "@mui/icons-material/Google";
import TwitterIcon from "@mui/icons-material/Twitter";
import ForumIcon from "@mui/icons-material/Forum";

type Props = {
  onClick: (provider: "google" | "twitter" | "discord") => void;
};

const SocialButtons = ({ onClick }: Props) => {
  return (
    <div className="grid grid-cols-3 gap-3">
      <SocialButton label="Google" icon={<GoogleIcon fontSize="small" />} onClick={() => onClick("google")} />
      <SocialButton label="Twitter" icon={<TwitterIcon fontSize="small" />} onClick={() => onClick("twitter")} />
      <SocialButton label="Discord" icon={<ForumIcon fontSize="small" />} onClick={() => onClick("discord")} />
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
