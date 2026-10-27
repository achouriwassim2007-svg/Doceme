// Topic pack: concept cards, each citing a source passage.
// To add a topic, copy this object and change the cards.
// ---------- Topic pack (cards cite a source passage; answer keys stay in code) ----------
const PACK={topic:"Reported speech: yes/no questions",level:"3AS",source:"Lesson plan: Reported speech (3AS)",cards:[
{id:"RS-01",type:"rule",idea:"Move the verb one step back in time (present becomes past).",key:/past|back ?shift|one step|tense|moves? back/i,wrong:/stay(s)? the same|no change|don'?t change|same tense/i,
 src:"Reporting verb in the past: the verb moves one step back, present simple becomes past simple.",sec:"Section 2, Backshift of tenses",
 test:'Sara said, "I like tea."',good:"Sara said she liked tea.",bad:"Sara said she likes tea.",
 why:"Why does the verb move back in time?",pre:{q:'Tom said, "I am tired." → Tom said he ___ tired.',o:["is","was","be"],a:1},post:{q:'"We play football." → They said they ___ football.',o:["played","play","will play"],a:0}},
{id:"RS-02",type:"rule",idea:"A yes/no question is reported with if or whether.",key:/\b(if|whether)\b/i,wrong:/use (that|what|which)|with that/i,
 src:"Reporting yes/no questions: use if or whether after the reporting verb.",sec:"Section 3, Reporting yes/no questions",
 test:'Ali asked, "Can you swim?"',good:"Ali asked if I could swim.",bad:"Ali asked that I could swim.",
 why:"What if the question starts with a wh-word instead? Is if still right?",pre:{q:"Which word starts a reported yes/no question?",o:["that","if","what"],a:1},post:{q:'Ali asked, "Is it ready?" → Ali asked ___ it was ready.',o:["whether","which","who"],a:0}},
{id:"RS-03",type:"rule",idea:"Use statement word order and remove do/does/did.",key:/(remove|delete|drop|no|without|disappear).*(do|does|did)|statement|normal order|subject.*verb/i,wrong:/keep (the )?(do|does|did)|question order|invert/i,
 src:"After if or whether the word order is that of a statement: do, does and did disappear.",sec:"Section 3, word order",
 test:'Mom asked, "Do you like English?"',good:"Mom asked if I liked English.",bad:"Mom asked if did I like English.",
 why:"Why does \"do\" disappear?",pre:{q:'"Do you sing?" → She asked if I ___.',o:["do sing","sang","did sing"],a:1},post:{q:'"Does he know?" → I asked if he ___.',o:["did know","knew","does know"],a:1}},
{id:"RS-04",type:"rule",idea:"Pronouns change to fit who is speaking now.",key:/pronoun|you.*(i|me)|\bi\b.*\b(he|she)\b|change.*(he|she|i|my|her|his)/i,wrong:/pronouns? (stay|are the same|don'?t change)|no pronoun/i,
 src:"Pronouns and possessives change according to the speaker and the listener.",sec:"Section 4, Pronouns",
 test:'Nour asked me, "Are you my friend?"',good:"Nour asked if I was her friend.",bad:"Nour asked if you were my friend.",
 why:"What if you report your own question? Which pronoun changes?",pre:{q:'Sam said to me, "Are you happy?" → Sam asked if ___ happy.',o:["you were","I was","he is"],a:1},post:{q:'Mia asked, "Do I look tired?" → Mia asked if ___ looked tired.',o:["I","she","you"],a:1}},
{id:"RS-05",type:"rule",idea:"The reported question ends with a full stop, not a question mark.",key:/full stop|period|no question mark|not .*question mark|dot/i,wrong:/keep (the )?question mark|question mark (stays|at the end)/i,
 src:"A reported question is a statement, so it ends with a full stop and has no question mark.",sec:"Section 3, punctuation",
 test:'Tom asked, "Is it late?"',good:"Tom asked if it was late.",bad:"Tom asked if it was late?",
 why:"Why is the question mark not needed?",pre:{q:"A reported yes/no question ends with:",o:["a question mark","a full stop","an exclamation mark"],a:1},post:{q:"Which is correct?",o:["He asked if I was ok.","He asked if I was ok?","He asked was I ok?"],a:0}}]};
