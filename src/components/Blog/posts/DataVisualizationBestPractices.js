import React from "react"

const DataVisualizationBestPractices = ({ }) => {
    return (
        <div className="DataVisualizationBestPractices">
            <h2>The Art and Science of Making Data Dance</h2>
            
            <p>
                Every chart tells a story. The question is: are you telling the right one?
            </p>

            <p>
                I've seen beautiful visualizations that lie, and ugly ones that reveal profound truths. 
                The difference isn't in the aesthetics—it's in understanding what makes data visualization 
                actually work.
            </p>

            <h3>The Hierarchy of Visual Perception</h3>
            <p>
                Your brain processes visual information in a very specific order:
            </p>
            <ol>
                <li><strong>Position</strong> - Most accurate way to encode quantitative data</li>
                <li><strong>Length</strong> - Why bar charts work so well</li>
                <li><strong>Angle/Slope</strong> - Line charts leverage this</li>
                <li><strong>Area</strong> - Treemaps, bubble charts (use sparingly)</li>
                <li><strong>Volume</strong> - 3D charts (usually avoid)</li>
                <li><strong>Color hue</strong> - Great for categories, terrible for quantities</li>
                <li><strong>Color saturation</strong> - Sequential data only</li>
            </ol>

            <p>
                <em>Rule of thumb:</em> If you can't read the values without labels, your encoding is probably wrong.
            </p>

            <h3>The Gestalt Principles in Data Viz</h3>
            
            <p><strong>Proximity:</strong> Things that are close together are perceived as related.</p>
            <p>Group related data points. Separate different categories with whitespace.</p>
            
            <p><strong>Similarity:</strong> Similar things are perceived as belonging together.</p>
            <p>Use consistent colors, shapes, and styles within categories.</p>
            
            <p><strong>Closure:</strong> We mentally complete incomplete shapes.</p>
            <p>You don't need grid lines everywhere—implied structure often works better.</p>

            <h3>The Tyranny of the Default</h3>
            
            <p>Most data visualization tools have terrible defaults:</p>
            <ul>
                <li>Excel's 3D charts with gradients and shadows</li>
                <li>Tableau's rainbow color schemes</li>
                <li>PowerBI's cluttered legends and excessive borders</li>
            </ul>
            
            <p>
                <strong>Your first job is to undo the damage.</strong> Remove everything that doesn't 
                directly support your message. Edward Tufte calls this maximizing the "data-to-ink ratio."
            </p>

            <h3>Color: The Double-Edged Sword</h3>
            
            <p>Color is powerful. Too powerful. It can:</p>
            <ul>
                <li>Highlight what's important</li>
                <li>Group related information</li>
                <li>Create emotional responses</li>
                <li>Make your viz completely unusable for 8% of men</li>
            </ul>

            <p><strong>ColorBrewer 2.0</strong> should be bookmarked. Period.</p>
            
            <p>Sequential palettes for ordered data. Diverging for data with a meaningful center. 
            Qualitative for categories—and never more than 7-8 categories if you want people to 
            actually distinguish them.</p>

            <h3>The Context Paradox</h3>
            
            <p>
                More context is always better, until it isn't. You need enough context for accurate 
                interpretation, but not so much that you overwhelm the main message.
            </p>
            
            <p><strong>Essential context:</strong></p>
            <ul>
                <li>What are the units? (%, thousands, millions)</li>
                <li>When is this data from?</li>
                <li>What's the sample size?</li>
                <li>Are there important exclusions or limitations?</li>
            </ul>
            
            <p><strong>Probably unnecessary context:</strong></p>
            <ul>
                <li>How the data was collected (unless it affects interpretation)</li>
                <li>Statistical methodology details</li>
                <li>Your personal opinions about the data</li>
            </ul>

            <h3>Interaction: Friend or Foe?</h3>
            
            <p>
                Interactive visualizations can be incredible tools for exploration. They can also be 
                crutches for poor design.
            </p>
            
            <p>
                <strong>Good interaction:</strong> Filtering, drilling down, comparing subsets<br/>
                <strong>Bad interaction:</strong> Requiring clicks to see basic information
            </p>
            
            <p>
                If your static version doesn't tell a clear story, adding interaction won't fix it. 
                It'll just make it an unclear story that takes longer to understand.
            </p>

            <h3>The Audience Reality Check</h3>
            
            <p>Ask yourself:</p>
            <ul>
                <li>How much time will they spend with this?</li>
                <li>What's their statistical literacy?</li>
                <li>What devices will they use?</li>
                <li>What action do I want them to take?</li>
            </ul>
            
            <p>
                A CEO scrolling on mobile needs a different approach than a data analyst at their desk. 
                Design for your actual audience, not your ideal one.
            </p>

            <h3>When Rules Should Be Broken</h3>
            
            <p>
                Sometimes you need to break these rules. When you do, make it intentional. 
                3D charts are usually terrible—but they might work for data about 3D space. 
                Pie charts are often criticized—but they're perfect when you want to emphasize 
                parts of a whole.
            </p>
            
            <p>
                <strong>The meta-rule:</strong> Every choice should serve your communication goal.
            </p>

            <h3>Testing and Iteration</h3>
            
            <p>
                The best data visualizers I know constantly test their work:
            </p>
            <ul>
                <li>Show it to someone unfamiliar with the data</li>
                <li>Ask them what they see first</li>
                <li>See if they can answer your key question without help</li>
                <li>Watch where their eyes go (literally—eye tracking studies are enlightening)</li>
            </ul>

            <p>
                <strong>Remember:</strong> You're not just displaying data. You're creating understanding. 
                The measure of a great visualization isn't how it looks—it's how quickly and accurately 
                it transfers knowledge from the data to the human brain.
            </p>
            
            <p>
                That's the real art: making complex information feel simple, important insights feel obvious, 
                and actionable conclusions feel inevitable.
            </p>
        </div>
    )
}

export default DataVisualizationBestPractices