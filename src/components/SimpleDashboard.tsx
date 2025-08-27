import React from 'react';

interface SimpleDashboardProps {
  habitNames: string[];
}

const SimpleDashboard: React.FC<SimpleDashboardProps> = ({ habitNames }) => {
  return (
    <div className="p-4 bg-white rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">Your Habits</h2>
      
      {habitNames.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-gray-500">No habits added yet.</p>
          <p className="text-sm text-gray-400 mt-2">Add your first habit to get started!</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {habitNames.map((habit, index) => (
            <li key={index} className="p-3 bg-gray-50 rounded-lg">
              {habit}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SimpleDashboard;
