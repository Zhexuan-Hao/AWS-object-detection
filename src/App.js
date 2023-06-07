
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import MyLayout from './pages/Layout';
import MySearch from './pages/Search';
import Modify from './pages/Modify';
import Update from './pages/Update';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
       <Routes>
            <Route path="/" element={
              <MyLayout/>
            }>
              <Route index element={<MySearch />} />
              <Route path="modify" element={<Modify />} />
              <Route path="update" element={<Update />} />
            </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
