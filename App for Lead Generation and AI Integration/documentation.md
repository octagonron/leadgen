# Travel Team Lead Generation App Documentation

## Overview

This application is designed to help you generate and manage leads for your travel package sales team. It focuses on identifying motivated "go-getters" who would be interested in selling travel packages as part of your team.

## Key Features

1. **Lead Capture Form**: Collects information from potential team members
2. **Lead Management Dashboard**: View, filter, and manage captured leads
3. **Keyword Targeting System**: Configure keywords to target specific audiences
4. **AI-Powered Lead Qualification**: Uses LLM to analyze and score leads
5. **Team Building Analytics**: Track your recruitment progress

## Application Structure

The application is built using Next.js and includes:

- **Frontend**: React components with Tailwind CSS for styling
- **Backend**: Next.js API routes with a database for storing leads and keywords
- **AI Integration**: Connection to LLM providers for lead qualification

## Pages

### Home Page (`/`)
- Main landing page with lead capture form
- Highlights benefits of joining your travel sales team
- Displays team statistics

### Dashboard (`/dashboard`)
- Overview of all captured leads
- Filtering and sorting capabilities
- Lead score visualization

### Lead Details (`/leads/[id]`)
- Detailed view of individual leads
- Contact information and interests
- AI-generated qualification notes
- Lead scoring metrics

### Keywords Management (`/keywords`)
- Add, edit, and delete targeting keywords
- Set priority levels for different keywords
- Filter keywords by category

### LLM Integration (`/llm-integration`)
- Configure AI provider settings
- Test LLM responses
- Set qualification criteria

### Testing Page (`/test`)
- Run tests to verify application functionality
- Check database connection
- Test lead form submission
- Verify keyword system
- Test LLM integration

## API Endpoints

### Lead Management
- `POST /api/leads`: Create a new lead
- `GET /api/leads/list`: Get all leads with pagination
- `GET /api/leads/[id]`: Get details for a specific lead
- `POST /api/leads/[id]/notes`: Update notes for a lead

### Keyword Management
- `GET /api/keywords`: Get all keywords
- `POST /api/keywords`: Add a new keyword
- `PATCH /api/keywords/[id]`: Update a keyword
- `DELETE /api/keywords/[id]`: Delete a keyword

### LLM Integration
- `GET /api/llm/config`: Get LLM configuration
- `POST /api/llm/config`: Save LLM configuration
- `POST /api/llm/test`: Test LLM with a prompt
- `POST /api/llm/qualify/[id]`: Qualify a lead using LLM

### Statistics and Testing
- `GET /api/stats`: Get application statistics
- `GET /api/test/database`: Test database connection

## Database Schema

The application uses a database with the following tables:

### Leads
Stores information about potential team members:
- id (primary key)
- name
- email
- phone
- location
- current_occupation
- experience_level
- motivation_level
- source
- created_at
- updated_at

### Keywords
Stores targeting keywords:
- id (primary key)
- keyword
- category
- priority
- created_at

### Lead Interests
Maps leads to their interests:
- id (primary key)
- lead_id (foreign key)
- keyword_id (foreign key)
- interest_level
- created_at

### Lead Scores
Stores AI-generated lead scores:
- id (primary key)
- lead_id (foreign key)
- total_score
- go_getter_score
- travel_interest_score
- sales_aptitude_score
- ai_qualification_notes
- created_at
- updated_at

## Deployment

This application can be deployed to any hosting platform that supports Next.js applications:

1. **Vercel**: Recommended for easy deployment
   - Connect your GitHub repository
   - Vercel will automatically build and deploy

2. **Netlify**: Another great option
   - Connect your GitHub repository
   - Set build command to `npm run build`
   - Set publish directory to `.next`

3. **Custom Server**: For more control
   - Build the application with `npm run build`
   - Start the server with `npm start`

## Local Development

To run the application locally:

1. Clone the repository
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## LLM Integration

The application supports multiple LLM providers:

1. **OpenAI**: Uses GPT models
2. **Anthropic**: Uses Claude models
3. **Cohere**: Uses Command models
4. **Custom**: Connect to your own LLM API

To configure LLM integration:
1. Go to the LLM Integration page
2. Select your preferred provider
3. Enter your API key
4. Choose the model
5. Save the configuration
6. Test the integration

## Lead Qualification Process

The application uses the following process to qualify leads:

1. Lead submits the form with their information
2. Initial score is calculated based on form responses
3. LLM analyzes the lead information for deeper insights
4. Lead is scored on:
   - Go-getter attitude (motivation)
   - Travel interest
   - Sales aptitude
5. Overall score determines lead quality
6. AI generates qualification notes with insights

## Customization

You can customize various aspects of the application:

1. **Lead Form Fields**: Modify the `LeadCaptureForm.tsx` component
2. **Scoring Algorithm**: Adjust the scoring logic in the API routes
3. **UI Design**: Update the Tailwind CSS styles
4. **LLM Prompts**: Change the prompts sent to the LLM for qualification

## Maintenance

Regular maintenance tasks:

1. **Update Keywords**: Regularly update keywords to match current trends
2. **Review Lead Scores**: Periodically review AI-generated scores for accuracy
3. **Update LLM Configuration**: Keep your LLM integration up to date
4. **Database Backup**: Regularly backup your lead database

## Troubleshooting

Common issues and solutions:

1. **Lead Form Not Submitting**: Check API route connectivity
2. **LLM Integration Failing**: Verify API key and endpoint
3. **Slow Dashboard Loading**: Implement pagination if lead count is high
4. **Incorrect Lead Scores**: Adjust the scoring algorithm or LLM prompts

## Support

For additional support or custom modifications, please contact the development team.

---

This documentation provides a comprehensive overview of your Travel Team Lead Generation App. It covers all aspects of the application from usage to maintenance, ensuring you can effectively use it to build your travel package sales team.
