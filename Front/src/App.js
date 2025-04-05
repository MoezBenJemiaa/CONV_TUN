import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./Login/Login";
import RegisterPage from "./Register/Register";
import UserProfile from "./Profile/UserProfile";
import HomePage from "./Home/home";
import Verification from "./Verification/Verification";
import Header from "./header/header1";
import ShowTrajets from "./trajet/showTrajets/ShowTrajets";
import Pagetrajet from "./trajet/trajet/PageTrajet";
import PublishTrip from "./trajet/PublishTrip/PublishTrip";
/*import Footer from "./Footer/footer";*/

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token"); // Check if token exists
  return token ? children : <Navigate to="/login" />;
}
function ProtectedRoute1({ children }) {
  const token = localStorage.getItem("token"); // Check if token exists
  if (token) {
    localStorage.clear();
  }
  return children;
}



function App() {
  return (
    <div>
      
      <Router>
        <Header/>
        
        <div>
          <Routes>
            <Route path="/login" element={<ProtectedRoute1><LoginPage /></ProtectedRoute1>} />
            <Route path="/Register" element={<ProtectedRoute1><RegisterPage/></ProtectedRoute1>} />
            <Route path="/Profile/:idUser" element={<UserProfile />} />
            <Route path="/Verification" element={<ProtectedRoute> <Verification /> </ProtectedRoute>} />
            <Route path="/" element={  <HomePage /> }/>
            <Route path="/MesTrajets/:ids" element={ <ProtectedRoute> <ShowTrajets/  > </ProtectedRoute>}/>
            <Route path="/Reservations/:ids" element={ <ProtectedRoute> <ShowTrajets/  > </ProtectedRoute>}/>
            <Route path="/Trajets/:ids" element={  <ShowTrajets/  > }/>
            <Route path="/trip/:id" element={  <Pagetrajet/  > }/>
            <Route path="/PublishTrip" element={ <ProtectedRoute> <PublishTrip /> </ProtectedRoute>}/>
          </Routes>
          </div>
        
      </Router>
    
    </div>
  );
}

export default App;
