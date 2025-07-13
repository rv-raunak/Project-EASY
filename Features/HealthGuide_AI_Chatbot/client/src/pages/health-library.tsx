import React, { useState } from "react";
import { AppHeader } from "@/components/header/app-header";
import { Navigation } from "@/components/sidebar/navigation";
import { MedicalDisclaimer } from "@/components/sidebar/medical-disclaimer";
import { DisclaimerFooter } from "@/components/footer/disclaimer-footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, BookOpen, Heart, Brain, Stethoscope, Activity, Shield, Baby, Eye } from "lucide-react";

interface HealthArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  tags: string[];
  readTime: number;
  lastUpdated: string;
}

export default function HealthLibrary() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedArticle, setSelectedArticle] = useState<HealthArticle | null>(null);

  const categories = [
    { id: "all", name: "All Topics", icon: BookOpen },
    { id: "general", name: "General Health", icon: Activity },
    { id: "heart", name: "Heart Health", icon: Heart },
    { id: "mental", name: "Mental Health", icon: Brain },
    { id: "respiratory", name: "Respiratory", icon: Stethoscope },
    { id: "prevention", name: "Prevention", icon: Shield },
    { id: "pediatric", name: "Pediatric", icon: Baby },
    { id: "vision", name: "Vision & Eye Care", icon: Eye }
  ];

  const healthArticles: HealthArticle[] = [
    {
      id: "1",
      title: "Understanding High Blood Pressure",
      summary: "Learn about hypertension, its causes, symptoms, and management strategies.",
      content: `High blood pressure, also known as hypertension, is a common condition where blood flows through your arteries at higher than normal pressures. It's often called the "silent killer" because it typically has no warning signs or symptoms.

**What is Blood Pressure?**
Blood pressure is measured using two numbers:
- Systolic pressure (top number): Pressure when your heart beats
- Diastolic pressure (bottom number): Pressure when your heart rests between beats

**Normal vs. High Blood Pressure:**
- Normal: Less than 120/80 mmHg
- Elevated: 120-129 systolic and less than 80 diastolic
- High Blood Pressure Stage 1: 130-139 systolic or 80-89 diastolic
- High Blood Pressure Stage 2: 140/90 mmHg or higher

**Risk Factors:**
- Age (risk increases with age)
- Family history
- Being overweight or obese
- Not being physically active
- Using tobacco
- Too much salt in diet
- Drinking too much alcohol
- Stress
- Certain chronic conditions

**Management and Prevention:**
- Maintain a healthy weight
- Exercise regularly
- Eat a balanced diet low in sodium
- Limit alcohol consumption
- Don't smoke
- Manage stress
- Monitor blood pressure regularly
- Take prescribed medications as directed

**When to See a Doctor:**
- If you have consistently high blood pressure readings
- If you experience symptoms like severe headaches, chest pain, or difficulty breathing
- For regular check-ups and monitoring

Remember: This information is for educational purposes only. Always consult with healthcare professionals for personalized medical advice.`,
      category: "heart",
      tags: ["hypertension", "cardiovascular", "prevention", "lifestyle"],
      readTime: 5,
      lastUpdated: "2024-01-15"
    },
    {
      id: "2",
      title: "Managing Stress and Anxiety",
      summary: "Effective techniques for managing stress and anxiety in daily life.",
      content: `Stress and anxiety are common experiences that can significantly impact your physical and mental health. Understanding how to manage these feelings is crucial for overall well-being.

**Understanding Stress vs. Anxiety:**
- Stress: A response to external pressures or demands
- Anxiety: Persistent worry or fear, often about future events

**Common Symptoms:**
Physical symptoms:
- Headaches
- Muscle tension
- Fatigue
- Sleep problems
- Digestive issues

Emotional symptoms:
- Irritability
- Restlessness
- Feeling overwhelmed
- Difficulty concentrating

**Stress Management Techniques:**
1. **Deep Breathing**: Practice slow, deep breathing exercises
2. **Progressive Muscle Relaxation**: Tense and release muscle groups
3. **Mindfulness Meditation**: Focus on the present moment
4. **Regular Exercise**: Physical activity reduces stress hormones
5. **Adequate Sleep**: Aim for 7-9 hours per night
6. **Healthy Diet**: Avoid excessive caffeine and sugar
7. **Social Support**: Connect with friends and family
8. **Time Management**: Prioritize tasks and set realistic goals

**When to Seek Professional Help:**
- Persistent anxiety that interferes with daily activities
- Panic attacks
- Avoiding social situations
- Substance use to cope with stress
- Thoughts of self-harm

**Professional Treatment Options:**
- Cognitive Behavioral Therapy (CBT)
- Medication (when appropriate)
- Support groups
- Counseling

Remember: Everyone experiences stress and anxiety differently. What works for one person may not work for another. It's important to find coping strategies that work for you and seek professional help when needed.`,
      category: "mental",
      tags: ["stress", "anxiety", "mental health", "coping strategies"],
      readTime: 7,
      lastUpdated: "2024-01-10"
    },
    {
      id: "3",
      title: "Importance of Regular Exercise",
      summary: "How physical activity benefits your overall health and well-being.",
      content: `Regular physical activity is one of the most important things you can do for your health. It benefits nearly every system in your body and can help prevent many health problems.

**Health Benefits of Exercise:**

**Physical Benefits:**
- Strengthens heart and improves circulation
- Helps control weight
- Builds and maintains strong bones and muscles
- Improves balance and coordination
- Reduces risk of chronic diseases
- Boosts immune system
- Improves sleep quality

**Mental Health Benefits:**
- Reduces symptoms of depression and anxiety
- Improves mood and self-esteem
- Enhances cognitive function
- Reduces stress
- Increases energy levels

**Types of Exercise:**
1. **Aerobic Exercise**: Walking, jogging, swimming, cycling
2. **Strength Training**: Weight lifting, resistance bands, bodyweight exercises
3. **Flexibility**: Stretching, yoga, tai chi
4. **Balance**: Yoga, tai chi, standing on one foot

**Getting Started:**
- Start slowly and gradually increase intensity
- Choose activities you enjoy
- Set realistic goals
- Make it a habit by scheduling regular exercise times
- Find a workout buddy for motivation

**Exercise Recommendations:**
- Adults: At least 150 minutes of moderate-intensity aerobic activity per week
- Plus muscle-strengthening activities 2 or more days per week
- Children: At least 60 minutes of physical activity daily

**Safety Tips:**
- Consult with a healthcare provider before starting a new exercise program
- Warm up before exercising and cool down afterward
- Stay hydrated
- Listen to your body and rest when needed
- Use proper form to prevent injury

**Common Barriers and Solutions:**
- "No time": Start with 10-minute sessions
- "Too expensive": Try free activities like walking or home workouts
- "Don't like gyms": Exercise outdoors or at home
- "Too tired": Start with light activities; energy will increase

Remember: Any amount of physical activity is better than none. Even small amounts of exercise can provide health benefits.`,
      category: "general",
      tags: ["exercise", "fitness", "physical activity", "health benefits"],
      readTime: 6,
      lastUpdated: "2024-01-08"
    },
    {
      id: "4",
      title: "Nutrition Basics for Healthy Living",
      summary: "Essential nutrition principles for maintaining good health.",
      content: `Proper nutrition is the foundation of good health. Understanding basic nutrition principles can help you make informed food choices and maintain a healthy lifestyle.

**Key Nutrients:**

**Macronutrients:**
- **Carbohydrates**: Body's main energy source (45-65% of calories)
- **Proteins**: Build and repair tissues (10-35% of calories)
- **Fats**: Energy storage and hormone production (20-35% of calories)

**Micronutrients:**
- **Vitamins**: Essential for various body functions
- **Minerals**: Support bone health, immune function, and more

**Building a Healthy Plate:**
- Fill half your plate with fruits and vegetables
- One quarter with lean protein
- One quarter with whole grains
- Include healthy fats in moderation

**Healthy Eating Guidelines:**
1. **Eat a variety of foods**: Different foods provide different nutrients
2. **Choose whole foods**: Minimize processed foods
3. **Control portions**: Use smaller plates and listen to hunger cues
4. **Stay hydrated**: Drink plenty of water throughout the day
5. **Limit added sugars and sodium**: Read nutrition labels
6. **Plan meals**: Prepare healthy meals and snacks in advance

**Foods to Emphasize:**
- Fruits and vegetables (variety of colors)
- Whole grains (brown rice, whole wheat bread, oats)
- Lean proteins (fish, poultry, legumes, nuts)
- Healthy fats (olive oil, avocados, nuts, seeds)
- Low-fat dairy or dairy alternatives

**Foods to Limit:**
- Processed and packaged foods
- Sugary drinks and snacks
- Excessive amounts of red meat
- Foods high in saturated and trans fats
- Excessive sodium

**Special Considerations:**
- **Children**: Need adequate calories and nutrients for growth
- **Older Adults**: May need more protein and certain vitamins
- **Pregnant Women**: Require additional nutrients like folate and iron
- **Athletes**: May need more calories and specific nutrients

**Meal Planning Tips:**
- Plan meals for the week
- Shop with a grocery list
- Prepare meals in batches
- Keep healthy snacks available
- Read nutrition labels

Remember: Good nutrition is about balance and making informed choices. Small changes can lead to significant health improvements over time.`,
      category: "general",
      tags: ["nutrition", "healthy eating", "diet", "wellness"],
      readTime: 8,
      lastUpdated: "2024-01-05"
    },
    {
      id: "5",
      title: "Sleep Hygiene and Better Rest",
      summary: "Tips for improving sleep quality and establishing healthy sleep habits.",
      content: `Quality sleep is essential for physical health, mental well-being, and overall quality of life. Understanding sleep hygiene can help you get the rest you need.

**Why Sleep Matters:**
- Helps the body repair and recover
- Consolidates memories and learning
- Supports immune function
- Regulates hormones
- Improves mood and cognitive function
- Maintains healthy weight

**Sleep Recommendations:**
- Adults: 7-9 hours per night
- Teenagers: 8-10 hours per night
- Children: 9-11 hours per night

**Sleep Hygiene Tips:**

**Bedroom Environment:**
- Keep bedroom cool (60-67°F)
- Make it as dark as possible
- Minimize noise or use white noise
- Invest in a comfortable mattress and pillows
- Remove electronic devices

**Sleep Schedule:**
- Go to bed and wake up at the same time every day
- Avoid long daytime naps (limit to 20-30 minutes)
- Create a relaxing bedtime routine

**Pre-Sleep Routine:**
- Start winding down 1-2 hours before bed
- Take a warm bath or shower
- Read a book or listen to calming music
- Practice relaxation techniques
- Avoid screens (blue light can interfere with sleep)

**Diet and Sleep:**
- Avoid large meals, caffeine, and alcohol before bedtime
- Don't go to bed hungry or overly full
- Limit fluids 2-3 hours before sleep
- Consider a light snack if needed

**Exercise and Sleep:**
- Regular exercise improves sleep quality
- Avoid vigorous exercise close to bedtime
- Morning sunlight exposure helps regulate circadian rhythm

**Common Sleep Disruptors:**
- Stress and anxiety
- Irregular sleep schedule
- Caffeine consumption
- Electronic device use before bed
- Uncomfortable sleep environment
- Medical conditions

**When to Seek Help:**
- Persistent insomnia
- Loud snoring or breathing interruptions
- Excessive daytime sleepiness
- Restless leg syndrome
- Frequent nightmares or night terrors

**Sleep Disorders:**
- **Insomnia**: Difficulty falling or staying asleep
- **Sleep Apnea**: Breathing interruptions during sleep
- **Restless Leg Syndrome**: Uncomfortable sensations in legs
- **Narcolepsy**: Excessive daytime sleepiness

**Natural Sleep Aids:**
- Chamomile tea
- Magnesium supplements
- Melatonin (consult healthcare provider)
- Lavender aromatherapy
- Progressive muscle relaxation

Remember: If you continue to have sleep problems despite good sleep hygiene, consult with a healthcare provider to rule out underlying sleep disorders.`,
      category: "general",
      tags: ["sleep", "insomnia", "rest", "sleep hygiene"],
      readTime: 7,
      lastUpdated: "2024-01-03"
    }
  ];

  const filteredArticles = healthArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (selectedArticle) {
    return (
      <div className="min-h-screen bg-clean-white">
        <AppHeader />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-3 mb-8 lg:mb-0">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedArticle(null)}
                  className="w-full mb-4"
                >
                  ← Back to Library
                </Button>
                <Navigation />
                <MedicalDisclaimer />
              </div>
            </div>
            
            <div className="lg:col-span-9">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-professional-dark">
                    {selectedArticle.title}
                  </CardTitle>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{selectedArticle.readTime} min read</span>
                    <span>Updated: {selectedArticle.lastUpdated}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedArticle.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-lg max-w-none">
                    <div className="whitespace-pre-wrap text-professional-dark">
                      {selectedArticle.content}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        
        <DisclaimerFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-clean-white">
      <AppHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-3 mb-8 lg:mb-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <Navigation />
              <MedicalDisclaimer />
            </div>
          </div>
          
          <div className="lg:col-span-9">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-professional-dark">Health Library</CardTitle>
                <CardDescription>
                  Browse trusted medical information and health articles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search health topics..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                  <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
                    {categories.map(category => {
                      const Icon = category.icon;
                      return (
                        <TabsTrigger 
                          key={category.id} 
                          value={category.id}
                          className="flex items-center space-x-1 text-xs"
                        >
                          <Icon className="w-3 h-3" />
                          <span className="hidden sm:inline">{category.name}</span>
                        </TabsTrigger>
                      );
                    })}
                  </TabsList>
                  
                  <TabsContent value={selectedCategory} className="mt-6">
                    <div className="grid gap-4">
                      {filteredArticles.map(article => (
                        <Card 
                          key={article.id}
                          className="hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => setSelectedArticle(article)}
                        >
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <CardTitle className="text-lg text-professional-dark hover:text-medical-blue">
                                  {article.title}
                                </CardTitle>
                                <CardDescription className="mt-2">
                                  {article.summary}
                                </CardDescription>
                              </div>
                              <div className="ml-4 text-sm text-gray-500">
                                {article.readTime} min read
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-3">
                              {article.tags.map(tag => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </CardHeader>
                        </Card>
                      ))}
                    </div>
                    
                    {filteredArticles.length === 0 && (
                      <div className="text-center py-12">
                        <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No articles found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Try adjusting your search terms or browse different categories.
                        </p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <DisclaimerFooter />
    </div>
  );
}