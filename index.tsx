import React, { useState, useEffect } from 'react';
import { Plus, Users, FileText, Download, FolderOpen, ArrowLeft, Calendar } from 'lucide-react';

export default function NabilContact() {
  const [currentPage, setCurrentPage] = useState('home');
  const [bodies, setBodies] = useState([]);
  const [selectedBody, setSelectedBody] = useState(null);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'detail'

  // Form states
  const [bodyNumber, setBodyNumber] = useState('');
  const [bodyStyle, setBodyStyle] = useState('');
  const [workerName, setWorkerName] = useState('');
  const [workerProcess, setWorkerProcess] = useState('');
  const [payment, setPayment] = useState('');

  // Update date/time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Add Body
  const addBody = () => {
    if (bodyNumber.trim() && bodyStyle.trim()) {
      const newBody = {
        id: Date.now(),
        number: bodyNumber,
        style: bodyStyle,
        workers: [],
        createdAt: new Date()
      };
      setBodies([...bodies, newBody]);
      setBodyNumber('');
      setBodyStyle('');
    }
  };

  // Add Worker to Body
  const addWorker = () => {
    if (workerName.trim() && workerProcess.trim() && selectedBody) {
      const newWorker = {
        id: Date.now(),
        name: workerName,
        process: workerProcess,
        payments: [],
        createdAt: new Date()
      };
      
      setBodies(bodies.map(body => 
        body.id === selectedBody.id 
          ? { ...body, workers: [...body.workers, newWorker] }
          : body
      ));
      
      setWorkerName('');
      setWorkerProcess('');
      setSelectedBody({
        ...selectedBody,
        workers: [...selectedBody.workers, newWorker]
      });
    }
  };

  // Add Payment to Worker
  const addPayment = () => {
    if (payment.trim() && selectedWorker && selectedBody) {
      const paymentData = {
        id: Date.now(),
        amount: parseFloat(payment) || 0,
        date: new Date()
      };

      setBodies(bodies.map(body => 
        body.id === selectedBody.id 
          ? {
              ...body,
              workers: body.workers.map(worker =>
                worker.id === selectedWorker.id
                  ? { ...worker, payments: [...worker.payments, paymentData] }
                  : worker
              )
            }
          : body
      ));

      setPayment('');
      setSelectedWorker(null);
      setSelectedBody(null);
      setCurrentPage('allData');
    }
  };

  // Calculate total payment for a worker
  const getTotalPayment = (worker) => {
    return worker.payments.reduce((sum, p) => sum + p.amount, 0);
  };

  // Download PDF function
  const downloadPDF = (data, filename) => {
    alert(`PDF Download: ${filename}\n\nএটি একটি ডেমো। আসল PDF জেনারেট করতে jsPDF লাইব্রেরি ব্যবহার করতে হবে।`);
  };

  const formatDateTime = (date) => {
    return new Date(date).toLocaleString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Smart Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Nabil Contact</h1>
            <div className="text-right">
              <div className="text-sm opacity-90">
                <Calendar className="inline mr-2" size={16} />
                {currentDateTime.toLocaleDateString('bn-BD', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              <div className="text-lg font-semibold">
                {currentDateTime.toLocaleTimeString('bn-BD')}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex gap-4">
            <button
              onClick={() => {
                setCurrentPage('home');
                setSelectedBody(null);
                setSelectedWorker(null);
              }}
              className={`px-4 py-2 rounded-lg transition ${
                currentPage === 'home' ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setCurrentPage('allWorker')}
              className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
                currentPage === 'allWorker' ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              <Users size={18} />
              All Worker
            </button>
            <button
              onClick={() => setCurrentPage('allData')}
              className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
                currentPage === 'allData' ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              <FileText size={18} />
              All Data
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        
        {/* HOME PAGE - Only Buttons */}
        {currentPage === 'home' && (
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
            <button
              onClick={() => setCurrentPage('createBody')}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:scale-105"
            >
              <Plus className="mx-auto mb-3" size={48} />
              <h3 className="text-2xl font-bold">Create Body Number</h3>
            </button>
            
            <button
              onClick={() => setCurrentPage('allWorker')}
              className="bg-gradient-to-r from-green-600 to-green-700 text-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:scale-105"
            >
              <Users className="mx-auto mb-3" size={48} />
              <h3 className="text-2xl font-bold">All Worker</h3>
            </button>
            
            <button
              onClick={() => setCurrentPage('allData')}
              className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:scale-105"
            >
              <FileText className="mx-auto mb-3" size={48} />
              <h3 className="text-2xl font-bold">All Data</h3>
            </button>
          </div>
        )}

        {/* CREATE BODY PAGE */}
        {currentPage === 'createBody' && (
          <div>
            <button
              onClick={() => setCurrentPage('home')}
              className="mb-4 flex items-center gap-2 text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft size={20} />
              Back to Home
            </button>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Add Body</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Body Number
                  </label>
                  <input
                    type="text"
                    value={bodyNumber}
                    onChange={(e) => setBodyNumber(e.target.value)}
                    placeholder="Example: 13213"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Style
                  </label>
                  <input
                    type="text"
                    value={bodyStyle}
                    onChange={(e) => setBodyStyle(e.target.value)}
                    placeholder="Example: S"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <button
                  onClick={addBody}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 font-semibold"
                >
                  <Plus size={20} />
                  Add Body
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ALL WORKER PAGE - Show Body Folders */}
        {currentPage === 'allWorker' && !selectedBody && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">All Worker View</h2>
            {bodies.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <FolderOpen className="mx-auto mb-4 text-gray-400" size={64} />
                <p className="text-gray-500 text-lg">কোন Body নেই। প্রথমে Body যোগ করুন।</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bodies.map((body, index) => (
                  <div
                    key={body.id}
                    onClick={() => {
                      setSelectedBody(body);
                      setCurrentPage('workerList');
                    }}
                    className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition cursor-pointer border-2 border-transparent hover:border-blue-500"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <FolderOpen className="text-blue-600" size={32} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{index + 1}. {body.number}</h3>
                        <p className="text-gray-600">Style: {body.style}</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      Workers: {body.workers.length}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* WORKER LIST - Show workers in selected body */}
        {currentPage === 'workerList' && selectedBody && !selectedWorker && (
          <div>
            <button
              onClick={() => {
                setSelectedBody(null);
                setCurrentPage('allWorker');
              }}
              className="mb-4 flex items-center gap-2 text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft size={20} />
              Back to All Worker
            </button>
            
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold mb-2">Body: {selectedBody.number}</h2>
              <p className="text-gray-600 mb-6">Style: {selectedBody.style}</p>
              
              <h3 className="text-xl font-bold mb-4">Add Worker</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Worker Name
                  </label>
                  <input
                    type="text"
                    value={workerName}
                    onChange={(e) => setWorkerName(e.target.value)}
                    placeholder="Enter worker name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Worker Process
                  </label>
                  <input
                    type="text"
                    value={workerProcess}
                    onChange={(e) => setWorkerProcess(e.target.value)}
                    placeholder="Enter process"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <button
                  onClick={addWorker}
                  className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2 font-semibold"
                >
                  <Plus size={20} />
                  Submit
                </button>
              </div>
            </div>

            {/* Workers List */}
            {selectedBody.workers.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4">Workers ({selectedBody.workers.length})</h3>
                <div className="space-y-3">
                  {selectedBody.workers.map((worker, index) => (
                    <div
                      key={worker.id}
                      onClick={() => {
                        setSelectedWorker(worker);
                        setCurrentPage('payment');
                      }}
                      className="p-4 bg-gray-50 rounded-lg hover:bg-blue-50 cursor-pointer transition border-2 border-transparent hover:border-blue-500"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-bold text-lg">{index + 1}. {worker.name}</h4>
                          <p className="text-gray-600">Process: {worker.process}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Payments: {worker.payments.length}</p>
                          <p className="font-bold text-green-600">৳{getTotalPayment(worker)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* PAYMENT PAGE */}
        {currentPage === 'payment' && selectedWorker && (
          <div>
            <button
              onClick={() => {
                setSelectedWorker(null);
                setCurrentPage('workerList');
              }}
              className="mb-4 flex items-center gap-2 text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft size={20} />
              Back to Workers
            </button>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-2">{selectedWorker.name}</h2>
              <p className="text-gray-600 mb-6">Process: {selectedWorker.process}</p>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Amount
                </label>
                <input
                  type="number"
                  value={payment}
                  onChange={(e) => setPayment(e.target.value)}
                  placeholder="Enter payment amount"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              
              <button
                onClick={addPayment}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 font-semibold"
              >
                Save Payment
              </button>
            </div>
          </div>
        )}

        {/* ALL DATA PAGE - Body List */}
        {currentPage === 'allData' && !selectedBody && (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-800">All Data - Body List</h2>
            {bodies.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <FileText className="mx-auto mb-4 text-gray-400" size={64} />
                <p className="text-gray-500 text-lg">কোন Body Data নেই</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bodies.map((body, index) => (
                  <div
                    key={body.id}
                    onClick={() => {
                      setSelectedBody(body);
                      setCurrentPage('bodyData');
                    }}
                    className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition cursor-pointer border-2 border-transparent hover:border-blue-500"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <FileText className="text-blue-600" size={32} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">Body: {body.number}</h3>
                        <p className="text-gray-600">Style: {body.style}</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 space-y-1">
                      <p>Workers: {body.workers.length}</p>
                      <p className="text-xs">{formatDateTime(body.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* BODY DATA PAGE - Individual Body Details */}
        {currentPage === 'bodyData' && selectedBody && (
          <div>
            <button
              onClick={() => {
                setSelectedBody(null);
                setCurrentPage('allData');
              }}
              className="mb-4 flex items-center gap-2 text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft size={20} />
              Back to All Data
            </button>

            <div className="bg-blue-600 text-white rounded-t-xl p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Body: {selectedBody.number}</h2>
                  <p className="text-xl mb-1">Style: {selectedBody.style}</p>
                  <p className="text-blue-100 text-sm">{formatDateTime(currentDateTime)}</p>
                </div>
                <button
                  onClick={() => downloadPDF(selectedBody, `body-${selectedBody.number}.pdf`)}
                  className="bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition flex items-center gap-2 font-semibold"
                >
                  <Download size={20} />
                  Download PDF
                </button>
              </div>
            </div>

            <div className="bg-white rounded-b-xl shadow-lg p-6">
              {selectedBody.workers.length === 0 ? (
                <p className="text-gray-500 text-center py-12">এই Body-তে কোন Worker নেই</p>
              ) : (
                <div className="space-y-6">
                  {selectedBody.workers.map((worker, workerIndex) => (
                    <div key={worker.id} className="border-b pb-6 last:border-b-0">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-800">
                            {workerIndex + 1}. {worker.name}
                          </h3>
                          <p className="text-lg text-gray-600">Process: {worker.process}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Total Payment</p>
                          <p className="text-3xl font-bold text-green-600">
                            ৳{getTotalPayment(worker)}
                          </p>
                        </div>
                      </div>

                      {worker.payments.length > 0 ? (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-bold mb-3">Payment History</h4>
                          <table className="w-full">
                            <thead>
                              <tr className="text-left border-b-2">
                                <th className="pb-2 text-gray-700">Date & Time</th>
                                <th className="pb-2 text-right text-gray-700">Payment</th>
                              </tr>
                            </thead>
                            <tbody>
                              {worker.payments.map((pay, payIndex) => (
                                <tr key={pay.id} className="border-b">
                                  <td className="py-3">{formatDateTime(pay.date)}</td>
                                  <td className="py-3 text-right font-bold text-green-600">
                                    ৳{pay.amount}
                                  </td>
                                </tr>
                              ))}
                              <tr className="font-bold bg-green-50">
                                <td className="py-3">Total</td>
                                <td className="py-3 text-right text-green-700 text-xl">
                                  ৳{getTotalPayment(worker)}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="text-gray-500 italic">কোন payment নেই</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}