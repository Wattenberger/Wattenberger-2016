import VisualDesign from "./posts/VisualDesign"
import DataVisualizationBestPractices from "./posts/DataVisualizationBestPractices"

const posts = [{
    title: "Visual vs. Visualization Design",
//     link: "visual-vs-visualization-design",
//     component: VisualDesign,
},{
    title: "Drawing a Map",
    // component: VisualDesign,
},{
    title: "Data Visualization Best Practices",
    component: DataVisualizationBestPractices,
}]
const processedPosts = _.map(posts, post => ({
    ...post,
    link: post.link || _.kebabCase(post.title),
}))

export default posts