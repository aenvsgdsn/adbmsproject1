import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getBooks, addBook, issueBook, returnBook, getUserBooks } from '../api';
import { Library, Plus, BookOpen, RotateCcw, AlertCircle, LayoutGrid } from 'lucide-react';
import toast from 'react-hot-toast';
import { format, differenceInDays } from 'date-fns';
import { PageHeader, SectionCard, TableWrapper, Modal, ModalFooter, FormField, SearchBar, EmptyState, Spinner } from '../components/UI';

const BookCard = ({ book, onIssue, canIssue }) => (
  <div className="card p-0 overflow-hidden flex flex-col group">
    <div className="relative aspect-[4/5] bg-slate-100 flex flex-col items-center justify-center text-slate-300"
      style={{ background: 'linear-gradient(135deg, rgba(239,246,255,0.60), rgba(219,234,254,0.40))' }}>
      <BookOpen size={48} className="mb-3 text-blue-200 group-hover:scale-110 transition-transform duration-500" />
      <span className="text-xs font-semibold px-4 text-center text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">{book.author}</span>
      <div className="absolute top-3 right-3">
        <span className={`badge ${book.available === 0 ? 'badge-red' : book.available <= 2 ? 'badge-yellow' : 'badge-green'}`}>
          {book.available} left
        </span>
      </div>
    </div>
    <div className="p-5 flex flex-col flex-grow">
      <h3 className="font-bold text-slate-800 text-sm leading-snug mb-1.5 line-clamp-2">{book.title}</h3>
      <p className="text-xs text-slate-400 mb-4">{book.author}</p>
      <div className="mt-auto">
        {canIssue && book.available > 0 ? (
          <button onClick={() => onIssue(book)} className="btn btn-secondary w-full justify-center">
            Issue Book
          </button>
        ) : canIssue ? (
          <button disabled className="btn bg-slate-100 text-slate-400 w-full justify-center cursor-not-allowed">
            Unavailable
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

  const [books, setBooks]               = useState([]);
  const [myBooks, setMyBooks]           = useState([]);
  const [loading, setLoading]           = useState(true);
  const [activeTab, setActiveTab]       = useState('catalog');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [search, setSearch]             = useState('');
  const [saving, setSaving]             = useState(false);
  const [addForm, setAddForm]           = useState({ title: '', author: '', copies: 1 });
  const [dueDate, setDueDate]           = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const [booksRes] = await Promise.all([getBooks()]);
      setBooks(booksRes.data || []);
      if (user?.id) {
        const myRes = await getUserBooks(user.id);
        setMyBooks(myRes.data || []);
      }
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleAddBook = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await addBook(addForm);
      toast.success('Book added to library!');
      setShowAddModal(false);
      setAddForm({ title: '', author: '', copies: 1 });
      load();
    } catch (err) { toast.error(err?.response?.data?.error || 'Failed to add book.'); }
    setSaving(false);
  };

  const handleIssue = async (e) => {
    e.preventDefault();
    if (!selectedBook || !dueDate) return toast.error('Select a book and due date.');
    setSaving(true);
    try {
      await issueBook({ book_id: selectedBook.book_id, user_id: user.id, due_date: dueDate });
      toast.success(`"${selectedBook.title}" issued!`);
      setShowIssueModal(false);
      setSelectedBook(null);
      setDueDate('');
      load();
    } catch (err) { toast.error(err?.response?.data?.error || 'Failed to issue book.'); }
    setSaving(false);
  };

  const handleReturn = async (issueId) => {
    try { await returnBook(issueId); toast.success('Book returned!'); load(); }
    catch (err) { toast.error(err?.response?.data?.error || 'Failed to return book.'); }
  };

  const filtered = books.filter(b => b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase()));

  const TAB_BTN = (tab, label, Icon) => (
    <button
      key={tab}
      onClick={() => setActiveTab(tab)}
      className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${activeTab === tab ? 'text-blue-700' : 'text-slate-500 hover:text-slate-700'}`}
      style={activeTab === tab ? { background: 'rgba(255,255,255,0.95)', border: '1px solid rgba(147,197,253,0.50)', boxShadow: '0 2px 8px rgba(37,99,235,0.10)' } : { border: '1px solid transparent' }}
    >
      <Icon size={15} />{label}
    </button>
  );

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="University Library"
        subtitle="Browse our extensive collection of educational resources"
        actions={isAdmin && (
          <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
            <Plus size={15} /> Add Book
          </button>
        )}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
        <div className="flex gap-1.5 p-1.5 rounded-xl w-fit" style={{ background: 'rgba(239,246,255,0.70)', border: '1px solid rgba(219,234,254,0.60)' }}>
          {TAB_BTN('catalog', `Catalog (${books.length})`, LayoutGrid)}
          {(isStudent || isFaculty) && TAB_BTN('my-books', `My Issues (${myBooks.filter(b => b.status === 'Issued').length})`, BookOpen)}
        </div>
        {activeTab === 'catalog' && (
          <div className="w-full sm:w-72">
            <SearchBar value={search} onChange={e => setSearch(e.target.value)} placeholder="Search catalog..." />
          </div>
        )}
      </div>

      {loading ? <Spinner /> : activeTab === 'catalog' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {filtered.length === 0
            ? <div className="col-span-full"><EmptyState icon={Library} title="No books found" /></div>
            : filtered.map(b => <BookCard key={b.book_id} book={b} canIssue={isStudent || isFaculty} onIssue={(book) => { setSelectedBook(book); setShowIssueModal(true); }} />)
          }
        </div>
      ) : (
        <SectionCard title="Issued Books">
          <TableWrapper>
            <thead><tr><th>Book Title</th><th>Issue Date</th><th>Due Date</th><th>Status</th><th className="text-right">Actions</th></tr></thead>
            <tbody>
              {myBooks.length === 0 ? (
                <tr><td colSpan={5}><EmptyState icon={BookOpen} title="No issued books" subtitle="You haven't issued any books yet." /></td></tr>
              ) : myBooks.map(b => {
                const daysLeft = b.due_date ? differenceInDays(new Date(b.due_date), new Date()) : 0;
                return (
                  <tr key={b.issue_id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-10 bg-slate-100 rounded flex items-center justify-center shrink-0 border border-slate-200">
                           <BookOpen size={14} className="text-slate-400"/>
                        </div>
                        <span className="font-semibold text-slate-800 text-sm">{b.library_items?.title}</span>
                      </div>
                    </td>
                    <td className="text-slate-500 text-sm">{b.issue_date ? format(new Date(b.issue_date), 'MMM d, yyyy') : '—'}</td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        {b.status === 'Issued' && daysLeft < 0 && <AlertCircle size={14} className="text-red-500" />}
                        <span className={`text-sm font-medium ${daysLeft < 0 && b.status === 'Issued' ? 'text-red-600' : 'text-slate-700'}`}>
                          {b.due_date ? format(new Date(b.due_date), 'MMM d, yyyy') : '—'}
                        </span>
                      </div>
                    </td>
                    <td><span className={`badge ${b.status === 'Issued' ? 'badge-blue' : 'badge-gray'}`}>{b.status}</span></td>
                    <td className="text-right">
                      {b.status === 'Issued' && (
                        <button onClick={() => handleReturn(b.issue_id)} className="btn btn-secondary btn-sm">
                          <RotateCcw size={13} /> Return
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </TableWrapper>
        </SectionCard>
      )}

      {showAddModal && (
        <Modal title="Add New Book" onClose={() => setShowAddModal(false)}>
          <form onSubmit={handleAddBook} className="space-y-4">
            <FormField label="Book Title">
              <input className="form-input" required placeholder="e.g. Clean Code" value={addForm.title} onChange={e => setAddForm({ ...addForm, title: e.target.value })} />
            </FormField>
            <FormField label="Author">
              <input className="form-input" required placeholder="e.g. Robert C. Martin" value={addForm.author} onChange={e => setAddForm({ ...addForm, author: e.target.value })} />
            </FormField>
            <FormField label="Initial Copies">
              <input type="number" className="form-input" min="1" required value={addForm.copies} onChange={e => setAddForm({ ...addForm, copies: +e.target.value })} />
            </FormField>
            <ModalFooter onCancel={() => setShowAddModal(false)} submitLabel="Save Book" loading={saving} icon={Plus} />
          </form>
        </Modal>
      )}

      {showIssueModal && (
        <Modal title="Issue a Book" onClose={() => setShowIssueModal(false)}>
          <form onSubmit={handleIssue} className="space-y-4">
            <div className="p-4 rounded-xl flex gap-4 mb-2" style={{ background: 'rgba(239,246,255,0.70)', border: '1px solid rgba(219,234,254,0.60)' }}>
              <div className="w-12 h-16 bg-white rounded flex items-center justify-center text-blue-300 shrink-0 border border-blue-100 shadow-sm">
                <BookOpen size={18} />
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="font-bold text-slate-800 text-sm">{selectedBook?.title || 'Select a book first'}</h3>
                <p className="text-xs text-slate-500 mt-1">{selectedBook?.author}</p>
              </div>
            </div>
            <FormField label="Select Book from Catalog">
              <select className="form-input form-select" required value={selectedBook?.book_id || ''} onChange={e => setSelectedBook(books.find(b => b.book_id === e.target.value))}>
                <option value="">-- Choose Book --</option>
                {books.filter(b => b.available > 0).map(b => (
                  <option key={b.book_id} value={b.book_id}>{b.title} ({b.available} left)</option>
                ))}
              </select>
            </FormField>
            <FormField label="Return Due Date">
              <input type="date" className="form-input" required value={dueDate} min={format(new Date(), 'yyyy-MM-dd')} onChange={e => setDueDate(e.target.value)} />
            </FormField>
            <ModalFooter onCancel={() => setShowIssueModal(false)} submitLabel="Confirm Issue" loading={saving} icon={BookOpen} />
          </form>
        </Modal>
      )}
    </div>
  );
};

export default LibraryPage;
