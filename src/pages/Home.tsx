import { useNavigate } from "react-router-dom";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { SEO } from "../components/SEO";
import { getWebsiteStructuredData } from "../utils/structuredData";

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      <SEO
        title="Home"
        description="Welcome to Quizzy - Create, manage, and take interactive quizzes. Make learning fun and engaging."
        structuredData={getWebsiteStructuredData()}
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-6">
              <MenuBookIcon className="text-white text-4xl" />
            </div>
            <h1 className="text-5xl font-bold text-white mb-4">Quizzy</h1>
            <p className="text-xl text-gray-400">
              Create, manage, and take interactive quizzes
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/admin")}
              className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold text-lg transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform"
            >
              Go to Admin Dashboard
            </button>
          </div>

          <div className="mt-12 text-gray-500 text-sm">
            <p>Manage quizzes, track student progress, and analyze results</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
