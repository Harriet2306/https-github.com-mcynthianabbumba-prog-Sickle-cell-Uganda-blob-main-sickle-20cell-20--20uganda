import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, updateDoc, doc, increment } from 'firebase/firestore';
import { db } from '../firebase';
import { MessageSquare, ThumbsUp, Send, User } from 'lucide-react';
import { motion } from 'motion/react';

interface Post {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: any;
  likesCount: number;
}

export const Community = ({ userId, userName }: { userId: string; userName: string }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'community_posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Post[];
      setPosts(data);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    try {
      await addDoc(collection(db, 'community_posts'), {
        authorId: userId,
        authorName: userName,
        content: newPost,
        createdAt: serverTimestamp(),
        likesCount: 0
      });
      setNewPost('');
    } catch (error) {
      console.error("Error adding post:", error);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      await updateDoc(doc(db, 'community_posts', postId), {
        likesCount: increment(1)
      });
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="text-red-600" />
        <h2 className="text-xl font-bold text-gray-900">Community Forum</h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Share your story or ask a question..."
          className="w-full p-3 border border-gray-100 rounded-lg text-sm h-24 focus:ring-2 focus:ring-red-100 outline-none transition-all"
          required
        />
        <div className="flex justify-end mt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
          >
            <Send size={16} />
            Post
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {posts.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-gray-100 rounded-full text-gray-500">
                <User size={16} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{post.authorName}</p>
                <p className="text-[10px] text-gray-400">
                  {post.createdAt?.toDate().toLocaleDateString()}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">{post.content}</p>
            <div className="flex items-center gap-4 pt-3 border-t border-gray-50">
              <button
                onClick={() => handleLike(post.id)}
                className="flex items-center gap-1.5 text-gray-500 hover:text-red-600 transition-colors text-xs font-medium"
              >
                <ThumbsUp size={14} />
                <span>{post.likesCount || 0} Likes</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
