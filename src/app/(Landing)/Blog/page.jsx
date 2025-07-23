"use client"

import { ArrowRight } from "lucide-react"

const BlogCard = ({ post }) => {
  return (
    <article
      className="bg-white rounded-2xl shadow-lg border overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-1 flex flex-col h-full"
      style={{
        borderColor: "#695aa6",
        boxShadow: "0 4px 6px rgba(105, 90, 166, 0.1)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 20px 25px rgba(105, 90, 166, 0.2)"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 4px 6px rgba(105, 90, 166, 0.1)"
      }}
    >
      <div className="p-4 sm:p-6 flex flex-col justify-between h-full">
        <div>
          <div className="text-3xl sm:text-4xl mb-3 sm:mb-4 text-center">{post.image}</div>
          <div className="text-xs sm:text-sm font-semibold mb-2 text-center" style={{ color: "#695aa6" }}>
            {post.category}
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3 text-center sm:text-left">
            {post.title}
          </h3>
          <p className="text-sm sm:text-base text-gray-600 text-center sm:text-left">{post.excerpt}</p>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 sm:mt-6 gap-2 sm:gap-0">
          <span className="text-xs sm:text-sm text-gray-500">{post.date}</span>
          <button
            className="text-sm sm:text-base font-medium flex items-center gap-1 transition-colors"
            style={{ color: "#695aa6" }}
            onMouseEnter={(e) => (e.target.style.color = "#5a4d8a")}
            onMouseLeave={(e) => (e.target.style.color = "#695aa6")}
          >
            Read More <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </article>
  )
}

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
    <section
      className="py-12 sm:py-16"
      style={{
        background: "linear-gradient(to top, #fff 0%, rgba(105, 90, 166, 0.35) 99%, rgba(105, 90, 166, 0.5) 100%)",
      }}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4" style={{ color: "#695aa6" }}>
            Latest Stories & Insights
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600">
            Stay updated with community impact and industry trends
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 items-stretch">
          {blogPosts.map((post, index) => (
            <BlogCard key={index} post={post} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Blog
