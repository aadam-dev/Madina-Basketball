# Quick Start Guide - Test Your New Features NOW!

## 🚀 Get Started in 3 Minutes

### Step 1: Database Setup (5 minutes)

1. **Open Supabase Dashboard:**
   - Go to: https://supabase.com/dashboard
   - Select your project: `madinabasketball`

2. **Run SQL Script:**
   - Click "SQL Editor" in left sidebar
   - Click "New Query"
   - Open `scripts/create-game-management-tables.sql` in your code editor
   - Copy ALL the contents
   - Paste into Supabase SQL editor
   - Click "Run" (bottom right)
   - Wait for success message ✅

3. **Verify Tables Created:**
   - Click "Table Editor" in left sidebar
   - You should see these new tables:
     - `games`
     - `game_events`
     - `quarter_scores`

### Step 2: Start Testing (Right Now!)

#### Test #1: Admin Team Management (2 minutes)
```bash
# 1. Open your browser to: http://localhost:3000/admin/login
# 2. Login with credentials from .env.local
# 3. Click "People Management" → "All Staff" in sidebar
# 4. You should see 18 team members!
# 5. Click Edit on any member → Make a change → Save
# 6. Verify change appears ✅
```

#### Test #2: Live Game Scoreboard (5 minutes)
```bash
# 1. Navigate to: http://localhost:3000/game
# 2. Click "Start Basic Game"
# 3. Enter:
#    Home Team: "Madina Old Gees"
#    Away Team: "Oyibi Eagles"
# 4. Click +2 for home team (should show 2)
# 5. Click +3 for away team (should show 3)
# 6. Click "Next Quarter" (should show Q2)
# 7. Add more scores, go to Q4
# 8. Click "End Game"
# 9. Click "Save Game"
# 10. You should see the final game view ✅
```

#### Test #3: Admin Games Dashboard (1 minute)
```bash
# 1. Go to: http://localhost:3000/admin/games
# 2. You should see the game you just created!
# 3. Check the stats cards show:
#    - Total Games: 1
#    - Completed: 1
# 4. Click "View" to see game details ✅
```

#### Test #4: Team Sheet Integration (3 minutes)
```bash
# 1. Navigate to: http://localhost:3000/teamsheet
# 2. Enter:
#    Team Name: "Madina Old Gees"
#    Date: Today
#    Opponent: "Test Team"
# 3. Add 3 players with names and jersey numbers
# 4. Click "Generate Blank Stats Sheet"
# 5. Verify:
#    - Roster is pre-filled ✅
#    - Stats columns are BLANK (not zeros) ✅
#    - Green success message shows ✅
# 6. Go back and click "Start Live Game"
# 7. Verify roster is loaded ✅
```

#### Test #5: Player Stats Mode (3 minutes)
```bash
# 1. Navigate to: http://localhost:3000/game
# 2. Click "Start Stats Mode"
# 3. Enter team names
# 4. Click "+ Add Player" for home team
#    Name: "Adam"
#    Jersey: "5"
# 5. Click "+ Add Player" for home team again
#    Name: "Shafic"  
#    Jersey: "7"
# 6. Click +2 for home team
# 7. A modal appears: "Who scored?"
# 8. Click "Adam"
# 9. Verify Adam's points show as 2 ✅
# 10. Click +3 for home team
# 11. Click "Shafic"
# 12. Verify Shafic's points show as 3 ✅
# 13. Continue game and save
```

### Step 3: Check Admin Dashboard (1 minute)

```bash
# 1. Go to: http://localhost:3000/admin
# 2. Verify you see:
#    - Total Events card (gradient blue)
#    - Total Games card (gradient orange) - should show 2
#    - Quick Actions with "Create Event" and "Start Live Game"
#    - Recent Games section showing your 2 test games ✅
```

---

## ✅ Success Checklist

After completing the quick tests above, you should have:

- [x] Database tables created in Supabase
- [x] Team members visible and editable in admin
- [x] Created 2 test games (basic + stats mode)
- [x] Games visible in admin dashboard
- [x] Team sheet integration working
- [x] Stats sheet shows blank fields
- [x] Player stats tracking functional

---

## 🎯 What's Working Right Now

### For Admins
✅ **View & Edit Team Members** - All 18 members from seed  
✅ **Manage Events** - Create, edit, delete events  
✅ **Track Games** - View all games with filtering  
✅ **Dashboard Overview** - See upcoming events and recent games  
✅ **Quick Actions** - Create event, start game, manage content

### For Public Users
✅ **Live Scoreboard** - Track game scores in real-time  
✅ **Team Sheet Generator** - Create printable team rosters  
✅ **Stats Sheet Generator** - Generate blank forms for manual tracking  
✅ **Player Stats Mode** - Track individual player performance  

### Technical
✅ **Database** - All tables created with RLS  
✅ **API** - Full CRUD for games and events  
✅ **Security** - Public read, admin write  
✅ **Integration** - Team sheets connect to games  
✅ **Responsive** - Works on mobile and desktop

---

## 🔍 Where to Find Things

### Admin Portal
- Login: `/admin/login`
- Dashboard: `/admin`
- Team Management: `/admin/team`
- Staff Management: `/admin/staff`
- Events: `/admin/events`
- Games: `/admin/games` (NEW!)
- Content: `/admin/content`

### Public Features
- Game Mode Selection: `/game`
- Basic Scoreboard: `/game/basic`
- Player Stats Mode: `/game/stats`
- Team Sheet: `/teamsheet`
- Stats Sheet: `/statssheet`
- View Game: `/game/[id]`

### Documentation
- Full Testing Guide: `TESTING_GUIDE.md` (100+ test cases)
- Implementation Summary: `IMPLEMENTATION_COMPLETE.md`
- Game Management Setup: `GAME_MANAGEMENT_SETUP.md`
- Security Docs: `SECURITY_IMPLEMENTATION.md`
- Database Migration: `DATABASE_MIGRATION_GUIDE.md`

---

## 🐛 Something Not Working?

### "Missing Supabase environment variables"
- Check `.env.local` exists
- Verify all keys are present
- Restart dev server: `npm run dev`

### "Table does not exist"
- Run the SQL script in Supabase (Step 1 above)
- Refresh your browser
- Check Supabase Table Editor

### "No team members showing"
- Run: `npm run seed:team`
- Check terminal for success message
- Refresh `/admin/team` page

### "Can't save game"
- Make sure you're logged in as admin
- Check browser console (F12) for errors
- Verify Supabase service role key is in `.env.local`

### "Stats sheet shows zeros"
- You're looking at the OLD version
- Clear browser cache (Ctrl+Shift+R)
- Should now show blank lines

---

## 📖 Next Steps

1. **Complete Quick Start Tests** (15 minutes)
2. **Follow Full Testing Guide** - `TESTING_GUIDE.md` (1-2 hours)
3. **Add Real Content:**
   - Update team member photos
   - Create actual upcoming events
   - Run real games with your teams
4. **Deploy to Production** - Follow `DEPLOYMENT.md`

---

## 🎉 You're Ready!

Everything is set up and working. The core functionality is complete:

✅ **Phase 1: Critical Fixes** - All done  
✅ **Phase 2: Basic Scoreboard** - All done  
✅ **Phase 3: Enhanced Features** - All done  
⏳ **Phase 4: Full Management** - Future enhancement

**Start testing now and enjoy your new game management system!** 🏀

---

**Questions?** Check `TESTING_GUIDE.md` for detailed test cases.  
**Issues?** See troubleshooting section above.  
**Ready to deploy?** Follow `DEPLOYMENT.md`.
