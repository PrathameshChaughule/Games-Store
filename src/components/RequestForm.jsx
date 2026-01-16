import axios from 'axios'
import { useState } from 'react'
import { toast } from 'react-toastify'

function RequestForm({ setShowRequestForm, scrollHandle }) {
    const userData = JSON.parse(localStorage.getItem("auth"))
    const [formData, setFormData] = useState({
        requestId: `REQ-${String(Math.floor(100 + Math.random() * 900))}`,
        customerId: userData.customerId,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        gameTitle: "",
        platform: "",
        requestDate: new Date().toISOString(),
        readStatus: "Unread",
        requestStatus: "Pending",
        staredStatus: "Unstared"
    })

    const formHandle = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const formSubmit = async () => {
        try {
            await axios.post("https://gamering-data.onrender.com/requests", formData)
            toast.success("Request Submitted")
            setShowRequestForm(null)
            scrollHandle()
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-2xl bg-[#121826] border border-white/10 rounded-2xl shadow-xl p-6">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-white">
                        Request a Game
                    </h2>
                    <p className="text-sm text-white/60">
                        Can’t find your favorite game? Let us know and we’ll try to add it.
                    </p>
                </div>

                <form onSubmit={() => formSubmit()} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm text-white/70">Request ID</label>
                            <input
                                type="text"
                                value={formData.requestId}
                                disabled
                                className="mt-1 w-full bg-[#0b0f19] text-white/70 border border-white/10 rounded-lg px-4 py-2 cursor-not-allowed"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-white/70">Customer ID</label>
                            <input
                                type="text"
                                value={formData.customerId}
                                disabled
                                className="mt-1 w-full bg-[#0b0f19] text-white/70 border border-white/10 rounded-lg px-4 py-2 cursor-not-allowed"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm text-white/70">Customer Name</label>
                            <input
                                type="text"
                                value={`${formData.firstName} ${formData.lastName}`}
                                disabled
                                className="mt-1 w-full bg-[#0b0f19] text-white/70 border border-white/10 rounded-lg px-4 py-2"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-white/70">Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                disabled
                                className="mt-1 w-full bg-[#0b0f19] text-white/70 border border-white/10 rounded-lg px-4 py-2"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm text-white/70">
                            Game Title <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter game title"
                            name='gameTitle'
                            value={formData.gameTitle}
                            required
                            onChange={(e) => formHandle(e)}
                            className="mt-1 w-full bg-[#0b0f19] text-white border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-white/70">
                            Platform <span className="text-red-400">*</span>
                        </label>
                        <select
                            value={formData.platform}
                            name='platform'
                            onChange={(e) => formHandle(e)}
                            required
                            className="mt-1 w-full bg-[#0b0f19] text-white border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">Select Platform</option>
                            <option value="pcGames">PC</option>
                            <option value="ps4Games">PlayStation 4</option>
                            <option value="ps5Games">PlayStation 5</option>
                            <option value="xboxGames">Xbox</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => setShowRequestForm(false)}
                            className="px-5 py-2 rounded-lg border cursor-pointer border-white/20 text-white/70 hover:bg-white/5"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="px-5 py-2 rounded-lg cursor-pointer bg-indigo-600 hover:bg-indigo-500 text-white font-medium"
                        >
                            Save Changes
                        </button>
                    </div>

                </form>
            </div>
        </div>

    )
}

export default RequestForm