import './App.css'
import React, { useState, useEffect } from 'react';
import { ChevronDown, Plus, Trophy, Medal, Award, Calendar, User, TrendingUp } from 'lucide-react';
import {
  getUsers,
  addUser,
  claimPoints,
  getHistory,
  getLeaderboard,
} from "./api";
  

// UserSelector Component
const UserSelector = ({ users, selectedUser, onUserSelect, onAddUser }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [showAddUserForm, setShowAddUserForm] = useState(false);

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (newUserName.trim()) {
      await onAddUser(newUserName.trim());
      setNewUserName('');
      setShowAddUserForm(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        {/* User Dropdown */}
        <div className="relative flex-1">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <span className="text-gray-700">
              {selectedUser ? selectedUser.name : 'Select User'}
            </span>
            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {users.map((user) => (
                <button
                  key={user._id}
                  onClick={() => {
                    onUserSelect(user);
                    setIsDropdownOpen(false);
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    {user.name}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Add User Button */}
        <button
          onClick={() => setShowAddUserForm(true)}
          className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Add User
        </button>
      </div>

      {/* Add User Form */}
      {showAddUserForm && (
        <div className="flex gap-2 p-4 bg-gray-50 rounded-lg border">
          <input
            type="text"
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
            placeholder="Enter user name"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoFocus
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddUser(e);
              }
            }}
          />
          <button
            onClick={handleAddUser}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Add
          </button>
          <button
            onClick={() => {
              setShowAddUserForm(false);
              setNewUserName('');
            }}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

// ClaimButton Component
const ClaimButton = ({ selectedUser, onClaim, lastClaim }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClaim = async () => {
    if (!selectedUser) return;
    
    setIsLoading(true);
    try {
      await onClaim(selectedUser._id);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleClaim}
        disabled={!selectedUser || isLoading}
        className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all transform hover:scale-105 disabled:transform-none shadow-lg"
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Claiming...
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <Trophy className="w-6 h-6" />
            Claim Points
          </div>
        )}
      </button>

      {lastClaim && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 text-green-800">
            <TrendingUp className="w-5 h-5" />
            <span className="font-semibold">+{lastClaim.pointsAwarded} points awarded!</span>
          </div>
          <p className="text-sm text-green-600 mt-1">
            Claimed at {new Date(lastClaim.timestamp).toLocaleTimeString()}
          </p>
        </div>
      )}
    </div>
  );
};

// Leaderboard Component
const Leaderboard = ({ leaderboard }) => {
  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-gray-500 font-semibold">{rank}</span>;
    }
  };

  const getRankBadge = (rank) => {
    const badgeClasses = {
      1: 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white',
      2: 'bg-gradient-to-r from-gray-300 to-gray-500 text-white',
      3: 'bg-gradient-to-r from-amber-400 to-amber-600 text-white'
    };
    
    return badgeClasses[rank] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Trophy className="w-6 h-6" />
          Leaderboard
        </h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leaderboard.map((user, index) => {
              const rank = index + 1;
              return (
                <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${getRankBadge(rank)}`}>
                      {rank <= 3 ? (
                        getRankIcon(rank)
                      ) : (
                        <span className="text-sm font-semibold">{rank}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm font-bold text-gray-900">{user.points.toLocaleString()}</div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// History Component
const History = ({ history }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gray-800 px-6 py-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Calendar className="w-6 h-6" />
          Claim History
        </h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Points Awarded</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {history.map((entry, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <div className="text-sm font-medium text-gray-900">
                      {typeof entry.user === "string" ? entry.user : entry.user.name}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    +{entry.points}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                  {new Date(entry.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [history, setHistory] = useState([]);
  const [lastClaim, setLastClaim] = useState(null);

  // Load initial data
useEffect(() => {
  const loadData = async () => {
    try {
      const [usersData, leaderboardData, historyData] = await Promise.all([
        getUsers(),
        getLeaderboard(),
        getHistory(),
      ]);

      setUsers(usersData.data);
      setLeaderboard(leaderboardData.data);
      setHistory(historyData.data);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  loadData();
}, []);



  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

 const handleAddUser = async (name) => {
  try {
    const res = await addUser(name);
    const newUser = res.data;
    setUsers(prev => [...prev, newUser]);
    setSelectedUser(newUser);
  } catch (error) {
    console.error("Error adding user:", error);
  }
};

  const handleClaim = async (userId) => {
  try {
    const res = await claimPoints(userId);
    const claimResult = res.data;
    setLastClaim(claimResult);

    setLastClaim(claimResult);
    console.log("Claim Result:", claimResult);
    setLeaderboard(prev =>
      prev.map(user =>
        user._id === claimResult.userId
          ? { ...user, points: claimResult.points }  // ✅ correct field
          : user
      ).sort((a, b) => b.points - a.points)
    );
    const userObj = users.find(u => u._id === userId);
    if (userObj) {
      setHistory(prev => [{
        user: userObj.name,
        points: claimResult.points,  // ✅ correct
        createdAt: claimResult.createdAt
      }, ...prev]);
    }
  } catch (error) {
    console.error("Error claiming points:", error);
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Leaderboard</h1>
          <p className="text-gray-600">Track points and compete with others</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - User Selection & Claim */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                User Selection
              </h3>
              <UserSelector
                users={users}
                selectedUser={selectedUser}
                onUserSelect={handleUserSelect}
                onAddUser={handleAddUser}
              />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Claim Points
              </h3>
              <ClaimButton
                selectedUser={selectedUser}
                onClaim={handleClaim}
                lastClaim={lastClaim}
              />
            </div>
          </div>

          {/* Right Column - Leaderboard & History */}
          <div className="lg:col-span-2 space-y-8">
            <Leaderboard leaderboard={leaderboard} />
            <History history={history} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;