import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getBooks, addBook, issueBook, returnBook, getUserBooks } from '../api';
import { Library, Plus, X, Loader2, BookOpen, RotateCcw, AlertCircle, Search, LayoutGrid, List } from 'lucide-react';
import toast from 'react-hot-toast';
import { format, differenceInDays } from 'date-fns';

const Modal = ({ title, onClose, children }) => (
  <div className="modal-backdrop animate-fade-in" onClick={onClose}>
    <div className="modal w-full max-w-lg animate-slide-up" onClick={e => e.stopPropagation()}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900 font-outfit">{title}</h2>
        <button onClick={onClose} className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"><X size={20} /></button>
      </div>
      {children}
    </div>
  </div>
);

const BookCard = ({ book, onIssue, canIssue }) => (
  <div className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
    <div className="relative aspect-[3/4] bg-slate-100 overflow-hidden">
        <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 bg-gradient-to-br from-slate-100 to-slate-200">
          <BookOpen size={48} className="mb-2 opacity-50" />
          <span className="text-xs font-medium px-4 text-center">{book.title}</span>
        </div>
      <div className="absolute top-3 right-3">
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold shadow-sm ${book.available === 0 ? 'bg-red-500 text-white' : book.available <= 2 ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white'}`}>
          {book.available} left
        </span>
      </div>
    </div>
    <div className="p-4 flex flex-col flex-grow">
      <h3 className="font-bold text-slate-800 leading-tight mb-1 line-clamp-2">{book.title}</h3>
      <p className="text-sm text-slate-500 mb-4">{book.author}</p>
      <div className="mt-auto">
        {canIssue && book.available > 0 ? (
          <button onClick={() => onIssue(book)} className="w-full py-2 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white font-semibold rounded-lg text-sm transition-colors duration-200">
            Issue Book
          </button>
        ) : canIssue ? (
          <button disabled className="w-full py-2 bg-slate-100 text-slate-400 font-semibold rounded-lg text-sm cursor-not-allowed">
            Currently Unavailable
          </button>
        ) : null}
      </div>
    </div>
  </div>
);

const LibraryPage = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';
  const isStudent = user?.role === 'Student';
  const isFaculty = user?.role === 'Faculty';

  const [books, setBooks] = useState([]);
  const [myBooks, setMyBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('catalog');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const [addForm, setAddForm] = useState({ title: '', author: '', copies: 1 });
  const [dueDate, setDueDate] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const [booksRes] = await Promise.all([getBooks()]);
      setBooks(booksRes.data || []);
      if (user?.id) {
        const myRes = await getUserBooks(user.id);
        setMyBooks(myRes.data || []);
      }
    } catch { }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleAddBook = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      await addBook(addForm);
      toast.success('Book added to library!');
      setShowAddModal(false);
      setAddForm({ title: '', author: '', copies: 1 });
      load();
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Failed to add book.');
    }
    setSaving(false);
  };

  const handleIssue = async e => {
    e.preventDefault();
    if (!selectedBook || !dueDate) return toast.error('Select a book and due date.');
    setSaving(true);
    try {
      await issueBook({ book_id: selectedBook.book_id, user_id: user.id, due_date: dueDate });
      toast.success(`"${selectedBook.title}" issued successfully!`);
      setShowIssueModal(false);
      setSelectedBook(null);
      setDueDate('');
      load();
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Failed to issue book.');
    }
    setSaving(false);
  };

  const handleReturn = async (issueId) => {
    try {
      await returnBook(issueId);
      toast.success('Book returned successfully!');
      load();
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Failed to return book.');
    }
  };

  const filtered = books.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-outfit">University Library</h1>
          <p className="text-slate-500 mt-1 font-medium">Browse our extensive collection of educational resources.</p>
        </div>
        <div className="flex gap-3">
          {isAdmin && (
            <button onClick={() => setShowAddModal(true)} className="btn btn-primary shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 hover:-translate-y-0.5 transition-all">
              <Plus size={16} className="mr-1" /> Add New Book
            </button>
          )}
        </div>
      </div>

      {/* Modern Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex gap-2 bg-slate-100 p-1.5 rounded-lg w-fit shadow-inner">
          <button onClick={() => setActiveTab('catalog')}
            className={`flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${
              activeTab === 'catalog' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}>
            <LayoutGrid size={16} /> Catalog ({books.length})
          </button>
          {(isStudent || isFaculty) && (
            <button onClick={() => setActiveTab('my-books')}
              className={`flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${
                activeTab === 'my-books' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}>
              <BookOpen size={16} /> My Issues ({myBooks.filter(b => b.status === 'Issued').length})
            </button>
          )}
        </div>
        
        {activeTab === 'catalog' && (
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow shadow-sm" 
              placeholder="Search catalog..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-blue-600" size={32} /></div>
      ) : activeTab === 'catalog' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filtered.length === 0 ? (
            <div className="col-span-full py-20 text-center bg-white rounded-xl border border-slate-200 border-dashed">
              <Library size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500 font-medium">No books found matching your search.</p>
            </div>
          ) : filtered.map(b => (
            <BookCard key={b.book_id} book={b} canIssue={isStudent || isFaculty} 
              onIssue={(book) => { setSelectedBook(book); setShowIssueModal(true); }} />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden animate-slide-up">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                  <th className="p-4">Book Title</th>
                  <th className="p-4">Issue Date</th>
                  <th className="p-4">Due Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {myBooks.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-12 text-slate-400 text-sm">You haven't issued any books yet.</td></tr>
                ) : myBooks.map(b => {
                  const daysLeft = b.due_date ? differenceInDays(new Date(b.due_date), new Date()) : 0;
                  return (
                    <tr key={b.issue_id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-semibold text-slate-800 flex items-center gap-3">
                        <div className="w-8 h-10 bg-slate-200 rounded shadow-sm overflow-hidden shrink-0">
                           <BookOpen size={16} className="m-auto mt-2 text-slate-400"/>
                        </div>
                        {b.library_items?.title}
                      </td>
                      <td className="p-4 text-slate-500 text-sm">{b.issue_date ? format(new Date(b.issue_date), 'MMM d, yyyy') : '—'}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5">
                          {b.status === 'Issued' && daysLeft < 0 && <AlertCircle size={14} className="text-red-500" />}
                          <span className={`text-sm font-medium ${daysLeft < 0 && b.status === 'Issued' ? 'text-red-600' : 'text-slate-700'}`}>
                            {b.due_date ? format(new Date(b.due_date), 'MMM d, yyyy') : '—'}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${b.status === 'Issued' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>{b.status}</span>
                      </td>
                      <td className="p-4 text-right">
                        {b.status === 'Issued' && (
                          <button onClick={() => handleReturn(b.issue_id)} className="inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-blue-600 text-sm font-medium rounded-lg transition-colors shadow-sm">
                            <RotateCcw size={14} /> Return
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Book Modal */}
      {showAddModal && (
        <Modal title="Add New Book" onClose={() => setShowAddModal(false)}>
          <form onSubmit={handleAddBook} className="space-y-4">
            <div className="form-group">
              <label className="text-sm font-semibold text-slate-700 mb-1 block">Book Title</label>
              <input className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" required placeholder="e.g. Clean Code"
                value={addForm.title} onChange={e => setAddForm({ ...addForm, title: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="text-sm font-semibold text-slate-700 mb-1 block">Author</label>
              <input className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" required placeholder="e.g. Robert C. Martin"
                value={addForm.author} onChange={e => setAddForm({ ...addForm, author: e.target.value })} />
            </div>
             <div className="form-group">
               <label className="text-sm font-semibold text-slate-700 mb-1 block">Initial Copies</label>
               <input type="number" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" min="1" required
                 value={addForm.copies} onChange={e => setAddForm({ ...addForm, copies: +e.target.value })} />
             </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
              <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
              <button type="submit" disabled={saving} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm">
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} Save Book
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Issue Book Modal */}
      {showIssueModal && (
        <Modal title="Issue a Book" onClose={() => setShowIssueModal(false)}>
          <form onSubmit={handleIssue} className="space-y-4">
            <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl flex gap-4 mb-2">
                <div className="w-16 h-24 bg-slate-200 rounded flex items-center justify-center text-slate-400 shrink-0">
                  <BookOpen size={20} />
                </div>
              <div className="flex flex-col justify-center">
                <h3 className="font-bold text-slate-800 leading-snug">{selectedBook?.title || 'Select a book first'}</h3>
                <p className="text-sm text-slate-500">{selectedBook?.author}</p>
              </div>
            </div>
            <div className="form-group">
              <label className="text-sm font-semibold text-slate-700 mb-1 block">Select Book from Catalog</label>
              <select className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" required
                value={selectedBook?.book_id || ''}
                onChange={e => setSelectedBook(books.find(b => b.book_id === e.target.value))}>
                <option value="">-- Choose Book --</option>
                {books.filter(b => b.available > 0).map(b => (
                  <option key={b.book_id} value={b.book_id}>{b.title} ({b.available} left)</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="text-sm font-semibold text-slate-700 mb-1 block">Return Due Date</label>
              <input type="date" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" required value={dueDate}
                min={format(new Date(), 'yyyy-MM-dd')}
                onChange={e => setDueDate(e.target.value)} />
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
              <button type="button" onClick={() => setShowIssueModal(false)} className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
              <button type="submit" disabled={saving || !selectedBook} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 shadow-sm">
                {saving ? <Loader2 size={16} className="animate-spin" /> : <BookOpen size={16} />} Confirm Issue
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default LibraryPage;
