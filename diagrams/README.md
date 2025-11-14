# HopkinsConnect Diagrams

This directory contains the architecture and network diagrams for the HopkinsConnect application deployment.

## Files

1. **ARCHITECTURE_DIAGRAM.md** - Component architecture showing all layers from CloudLab to application
2. **NETWORK_DIAGRAM.md** - Network topology, IP addressing, and traffic flow
3. **README.md** - This file

---

## How to Use These Diagrams

### Option 1: Use as Text Documentation (Quick & Easy)
- ✅ The ASCII diagrams are already complete and detailed
- ✅ Can be submitted directly in your homework document
- ✅ Include your JHEDIDs at the top of each file
- ✅ Take screenshots with your JHEDIDs visible

### Option 2: Convert to Visual Diagrams (Recommended for Presentation)

#### Using draw.io (Free & Easy)
1. Go to https://app.diagrams.net/
2. Create a new diagram
3. Use the text diagrams as reference
4. Add these components:
   - Rectangles for services
   - Cylinders for databases
   - Cloud shapes for infrastructure
   - Arrows for data flow
5. Export as PNG or PDF
6. Add your JHEDIDs as text boxes

#### Using PowerPoint/Keynote
1. Open PowerPoint or Keynote
2. Insert shapes from the toolbar
3. Follow the structure from the text diagrams
4. Use different colors for different layers:
   - Blue = Frontend
   - Green = Backend
   - Orange = Database
   - Gray = Infrastructure
5. Add connectors for traffic flow
6. Add text boxes with your JHEDIDs

#### Using Lucidchart (Professional)
1. Go to https://lucidchart.com
2. Sign up with your .edu email (free for students)
3. Choose "Kubernetes" or "Network Diagram" template
4. Import or recreate the structure
5. Export as PNG/PDF

---

## What to Include in Your Homework Submission

### For Part 1: Architecture Diagram

**Required Elements:**
- [ ] CloudLab infrastructure layer
- [ ] OpenStack components (Keystone, Nova, Neutron, Magnum, etc.)
- [ ] Kubernetes cluster (master + workers)
- [ ] Frontend deployment (2 replicas)
- [ ] Backend deployment (2 replicas)
- [ ] LoadBalancer service
- [ ] ClusterIP service
- [ ] Persistent Volume + PVC
- [ ] Kubernetes Secrets
- [ ] Network Policies
- [ ] Technology labels (Nginx, Node.js, Express, SQLite, etc.)
- [ ] Your JHEDIDs: mshahi2, [partner JHEID]

### For Part 1: Network Diagram

**Required Elements:**
- [ ] Internet entry point
- [ ] OpenStack Neutron router
- [ ] External IP addresses (192.168.1.x)
- [ ] LoadBalancer service with external IP
- [ ] Frontend pods with Pod IPs (10.244.1.x)
- [ ] Backend pods with Pod IPs (10.244.2.x)
- [ ] ClusterIP service (internal only)
- [ ] Pod network CIDR (10.244.0.0/16)
- [ ] Service network CIDR (10.96.0.0/12)
- [ ] Network policy rules (arrows showing allowed/denied traffic)
- [ ] Persistent Volume (local filesystem)
- [ ] Port numbers (80, 3000)
- [ ] Traffic flow arrows
- [ ] Security zones (Public, DMZ, Internal, Restricted)
- [ ] Your JHEDIDs: mshahi2, [partner JHEID]

---

## Quick Visual Reference

### Color Scheme Recommendation
```
🔵 Blue:     Frontend components
🟢 Green:    Backend components
🟠 Orange:   Database/Storage
🔴 Red:      Security components (firewalls, policies)
⚫ Gray:     Infrastructure (OpenStack, Kubernetes)
🟡 Yellow:   External/Internet
```

### Symbol Key
```
┌─────┐  
│ Box │   = Component/Service
└─────┘

   ↓      = Data flow / Traffic direction
   
═══════   = Security boundary

─ ─ ─ ─   = Optional/future component

( pod )   = Container/Pod

{ DB }    = Database

[LB]      = Load Balancer

*FW*      = Firewall
```

---

## Example Simplified Architecture Diagram

For quick reference, here's a minimal version you can draw:

```
                    Internet
                       ↓
              [LoadBalancer Service]
              (External IP: 192.168.1.150)
                       ↓
         ┌─────────────┴─────────────┐
         ↓                           ↓
  [Frontend Pod 1]          [Frontend Pod 2]
  (10.244.1.10:80)          (10.244.1.11:80)
         ↓                           ↓
         └─────────────┬─────────────┘
                       ↓
              [ClusterIP Service]
              (backend-service:3000)
                       ↓
         ┌─────────────┴─────────────┐
         ↓                           ↓
  [Backend Pod 1]           [Backend Pod 2]
  (10.244.2.20:3000)        (10.244.2.21:3000)
         ↓                           ↓
         └─────────────┬─────────────┘
                       ↓
            [Persistent Volume]
            (SQLite Database)
```

---

## Screenshot Best Practices

### How to Add Your JHEDIDs

**Method 1: Add to the diagram itself (Recommended)**
```
Add a text box at the top or bottom of your diagram:
┌─────────────────────────────────────────┐
│ Created by: mshahi2, [partner_JHEID]    │
│ Date: November 13, 2025                 │
│ Course: EN.650.663 Cloud Security       │
└─────────────────────────────────────────┘
```

**Method 2: Terminal window in screenshot**
```bash
# Open terminal and display your JHEDIDs
echo "mshahi2 and [partner_JHEID]"
echo "HopkinsConnect Architecture Diagram"
date

# Arrange your diagram and terminal side-by-side
# Take screenshot of both together
```

**Method 3: Text file visible in screenshot**
```bash
# Create a small text file
cat > student_info.txt << EOF
Students: mshahi2, [partner_JHEID]
Assignment: Homework 6
Application: HopkinsConnect
Date: November 13, 2025
EOF

# Open the file in a text editor
# Include it in the screenshot
```

---

## Submission Checklist

### Before Submitting:
- [ ] Both diagrams are complete (architecture + network)
- [ ] All required components are shown
- [ ] JHEDIDs are clearly visible (both partners)
- [ ] Diagrams are clear and readable
- [ ] Labels are accurate (IP addresses, ports, services)
- [ ] Traffic flow is indicated with arrows
- [ ] Security controls are highlighted
- [ ] Exported as PNG or PDF (300 DPI minimum)
- [ ] File names are descriptive:
  - `mshahi2_architecture_diagram.png`
  - `mshahi2_network_diagram.png`

### To Submit:
1. **Option A**: Insert diagrams directly into your Homework6.md document
2. **Option B**: Include diagrams as separate PNG/PDF files in a zip folder
3. **Option C**: Add to your answers document with clear section headers

---

## Getting Actual IP Addresses

Once your Kubernetes cluster is deployed, get the real IP addresses:

```bash
# Get LoadBalancer external IP
kubectl get svc frontend-service

# Get pod IPs
kubectl get pods -o wide

# Get ClusterIP addresses
kubectl get svc

# Get node information
kubectl get nodes -o wide
```

Replace the placeholder IPs in your diagrams with these actual values!

---

## Need Help?

If you need help creating visual diagrams:
1. Use the text diagrams as a reference
2. Start with the simplified version above
3. Add more detail gradually
4. Focus on clarity over complexity
5. Ask your professor if ASCII diagrams are acceptable

**The text-based diagrams in this folder are already comprehensive and can be submitted as-is with your JHEDIDs added!**

---

## Tools Summary

| Tool | Cost | Ease of Use | Quality | Link |
|------|------|-------------|---------|------|
| draw.io | Free | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | https://app.diagrams.net |
| PowerPoint | $$ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | Microsoft Office |
| Google Slides | Free | ⭐⭐⭐⭐ | ⭐⭐⭐ | https://slides.google.com |
| Lucidchart | Free (edu) | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | https://lucidchart.com |
| Excalidraw | Free | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | https://excalidraw.com |
| Figma | Free | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | https://figma.com |

**Recommendation**: Start with draw.io for quick, professional-looking diagrams!

---

**Good luck with your homework submission!** 🎓

