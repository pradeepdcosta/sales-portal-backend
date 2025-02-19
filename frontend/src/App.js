import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login/Login';
import AccountSelection from './components/AccountSelection/AccountSelection';
import AccountPlan from './components/AccountPlan/AccountPlan';
import SectionView from './components/SectionView/SectionView';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/accounts" element={<AccountSelection />} />
        <Route path="/account/:accountId" element={<AccountPlan />} />
        <Route path="/account/:accountId/section/:sectionId" element={<SectionView />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App; 