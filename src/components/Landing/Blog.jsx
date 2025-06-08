'use client'

import { ArrowRight } from "lucide-react"

const BlogCard = ({ post }) => {
  return (
    <article
      className="bg-white rounded-2xl shadow-lg border overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-1 flex flex-col h-full"
      style={{
        borderColor: '#695aa6',
        boxShadow: '0 4px 6px rgba(105, 90, 166, 0.1)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 20px 25px rgba(105, 90, 166, 0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 6px rgba(105, 90, 166, 0.1)';
      }}
    >
      <div className="p-6 flex flex-col justify-between h-full">
        <div>
          <div className="text-4xl mb-4">{post.image}</div>
          <div className="text-sm font-semibold mb-2" style={{ color: '#695aa6' }}>
            {post.category}
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3">{post.title}</h3>
          <p className="text-gray-600">{post.excerpt}</p>
        </div>
        <div className="flex justify-between items-center mt-6">
          <span className="text-sm text-gray-500">{post.date}</span>
          <button
            className="font-medium flex items-center gap-1 transition-colors"
            style={{ color: '#695aa6' }}
            onMouseEnter={(e) => (e.target.style.color = '#5a4d8a')}
            onMouseLeave={(e) => (e.target.style.color = '#695aa6')}
          >
            Read More <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </article>
  );
};


const Blog = () => {
  const blogPosts = [
    {
      title: "Empowering Rural Women Through Skill Development",
      excerpt: "How our training programs are helping women in remote areas build sustainable careers...",
      date: "June 2, 2025",
      image: "🌸",
      category: "Community Impact",
    },
    {
      title: "Digital Revolution in Rural India",
      excerpt: "Bridging the digital divide with accessible technology solutions for rural communities...",
      date: "May 28, 2025",
      image: "📱",
      category: "Technology",
    },
    {
      title: "Sustainable Agriculture: The Future is Here",
      excerpt: "Modern farming techniques that are environmentally friendly and economically viable...",
      date: "May 25, 2025",
      image: "🌱",
      category: "Agriculture",
    },
  ]

  return (
    <section className="py-16" 
             style={{
               background: 'linear-gradient(to top, #fff 0%, rgba(105, 90, 166, 0.35) 99%, rgba(105, 90, 166, 0.5) 100%)'
             }}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4" style={{color: '#695aa6'}}>Latest Stories & Insights</h2>
          <p className="text-xl text-gray-600">Stay updated with community impact and industry trends</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {blogPosts.map((post, index) => (
            <BlogCard key={index} post={post} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Blog