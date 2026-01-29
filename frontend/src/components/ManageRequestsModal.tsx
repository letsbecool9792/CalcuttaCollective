interface JoinRequest {
  id: string
  hangoutId: string
  userId: string
  userName: string
  message: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: number
}

interface ManageRequestsModalProps {
  hangoutTitle: string
  requests: JoinRequest[]
  onClose: () => void
  onApprove: (requestId: string) => void
  onReject: (requestId: string) => void
}

export default function ManageRequestsModal({ 
  hangoutTitle, 
  requests, 
  onClose, 
  onApprove, 
  onReject 
}: ManageRequestsModalProps) {
  const pendingRequests = requests.filter(r => r.status === 'pending')

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-lg w-full p-6 shadow-xl max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-stone-800">Join Requests</h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600">
            ✕
          </button>
        </div>

        <p className="text-stone-600 mb-6 text-sm">
          Manage requests for <span className="font-medium">"{hangoutTitle}"</span>
        </p>
        
        {pendingRequests.length === 0 ? (
          <div className="text-center py-8 text-stone-500">
            <p className="text-3xl mb-2">📭</p>
            <p>No pending requests</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingRequests.map(request => (
              <div key={request.id} className="border border-stone-200 rounded-lg p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold shrink-0">
                    {request.userName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-stone-800">{request.userName}</h3>
                    <p className="text-xs text-stone-500">
                      {new Date(request.createdAt).toLocaleDateString('en-IN', { 
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                {request.message && (
                  <p className="text-sm text-stone-600 bg-stone-50 p-3 rounded-lg mb-3 italic">
                    "{request.message}"
                  </p>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => onApprove(request.id)}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => onReject(request.id)}
                    className="flex-1 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors font-medium text-sm"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-stone-200">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
