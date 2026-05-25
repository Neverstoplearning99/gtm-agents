import cairosvg

W, H = 1400, 1700

INK = "#1a1a2e"
CHAT = "#7c3aed"
CODE = "#0ea5e9"
COWORK = "#f59e0b"
BRAIN = "#10b981"
LIGHT = "#f8f8fb"
GREY = "#6b7280"
LINE = "#94a3b8"


def box(x, y, w, h, fill, stroke, rx=18, sw=3):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>'


def text(x, y, s, size=26, fill=INK, weight="normal", anchor="middle", family="Helvetica, Arial, sans-serif"):
    return f'<text x="{x}" y="{y}" font-family="{family}" font-size="{size}" font-weight="{weight}" fill="{fill}" text-anchor="{anchor}">{s}</text>'


def arrow(x1, y1, x2, y2, color=LINE, sw=4, dash=""):
    d = f' stroke-dasharray="{dash}"' if dash else ""
    return f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{color}" stroke-width="{sw}" marker-end="url(#ah)"{d}/>'


parts = []
parts.append(f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">')
parts.append(f'<rect width="{W}" height="{H}" fill="white"/>')
parts.append('<defs><marker id="ah" markerWidth="12" markerHeight="12" refX="9" refY="4" orient="auto"><path d="M0,0 L9,4 L0,8 z" fill="' + LINE + '"/></marker></defs>')

# Title
parts.append(text(W/2, 70, "KNOWLEDGE TRANSFER SYSTEM", 44, INK, "bold"))
parts.append(text(W/2, 110, "One memory. Three Claudes. No lost context.", 24, GREY))

# --- Layer 1: The three Claudes ---
parts.append(text(W/2, 185, "THE THREE CLAUDES (separate, do not sync on their own)", 22, GREY, "bold"))

bw, bh = 360, 150
y1 = 215
xs = [70, 520, 970]
labels = [("CLAUDE CHAT", CHAT, "claude.ai", "phone + web"),
          ("CLAUDE CODE", CODE, "terminal", "writes files"),
          ("COWORK", COWORK, "workspace", "team space")]
for x, (name, col, sub1, sub2) in zip(xs, labels):
    parts.append(box(x, y1, bw, bh, LIGHT, col, 18, 4))
    parts.append(text(x+bw/2, y1+55, name, 30, col, "bold"))
    parts.append(text(x+bw/2, y1+95, sub1, 22, INK))
    parts.append(text(x+bw/2, y1+125, sub2, 20, GREY))

# arrows down to trigger
ty = 470
for x in xs:
    parts.append(arrow(x+bw/2, y1+bh, x+bw/2, ty-10))

# --- Layer 2: Trigger ---
trig_y = ty
parts.append(box(360, trig_y, 680, 110, "#fff7ed", "#ea580c", 22, 4))
parts.append(text(W/2, trig_y+50, 'TRIGGER:  "Pack handoff for [target]"', 30, "#c2410c", "bold"))
parts.append(text(W/2, trig_y+88, 'or  #obsidian  to save it down', 24, GREY))

# arrow to template
parts.append(arrow(W/2, trig_y+110, W/2, trig_y+170))

# --- Layer 3: Handoff template ---
th_y = trig_y + 170
parts.append(box(300, th_y, 800, 230, LIGHT, INK, 22, 3))
parts.append(text(W/2, th_y+45, "HANDOFF TEMPLATE (auto-filled)", 26, INK, "bold"))
rows = ["Origin and evolution", "Key decisions", "Risks and watch-outs",
        "Plan of action (agent-ready)", "Open questions"]
for i, r in enumerate(rows):
    yy = th_y + 85 + i*30
    parts.append(text(360, yy, "•", 24, BRAIN, "start"))
    parts.append(text(385, yy, r, 22, INK, "normal", "start"))

# arrow to brain
parts.append(arrow(W/2, th_y+230, W/2, th_y+300))

# --- Layer 4: Obsidian Brain ---
br_y = th_y + 300
parts.append(box(250, br_y, 900, 250, "#ecfdf5", BRAIN, 24, 5))
parts.append(text(W/2, br_y+50, "OBSIDIAN  “BRAIN”  VAULT", 34, "#047857", "bold"))
parts.append(text(W/2, br_y+85, "the single source of truth that all three feed into", 22, GREY))

folders = ["00-Inbox", "01-Knowledge-Transfer", "02-Clients",
           "03-BurnRate", "04-Projects", "05-People"]
fx0 = 300
for i, f in enumerate(folders):
    col = i % 3
    row = i // 3
    fx = fx0 + col*290
    fy = br_y + 130 + row*55
    parts.append(box(fx, fy, 265, 42, "white", BRAIN, 10, 2))
    parts.append(text(fx+132, fy+28, f, 20, "#065f46"))

# --- Loop back arrow (Brain feeds back into the Claudes) ---
# curved arrow on the right side from brain up to top
loop_x = 1180
parts.append(f'<path d="M {loop_x} {br_y+125} C 1340 {br_y+125}, 1340 {y1+bh/2}, {970+bw+5} {y1+bh/2}" fill="none" stroke="{BRAIN}" stroke-width="4" stroke-dasharray="10 8" marker-end="url(#ah)"/>')
parts.append(text(1330, (br_y+y1)/2 + 40, "context", 20, "#047857", "bold", "middle", "Helvetica"))
parts.append(text(1330, (br_y+y1)/2 + 65, "flows back", 20, "#047857", "bold", "middle", "Helvetica"))

# --- Footer: what you do ---
fy = br_y + 290
parts.append(box(250, fy, 900, 120, "#1a1a2e", "#1a1a2e", 20, 0))
parts.append(text(W/2, fy+45, "HOW IT WORKS IN ONE LINE", 22, "#fbbf24", "bold"))
parts.append(text(W/2, fy+85, "Finish anywhere → say the trigger → paste into the next Claude → Brain remembers.", 22, "white"))

parts.append('</svg>')

svg = "\n".join(parts)
with open("/home/user/gtm-agents/workspace/kt_diagram.svg", "w") as f:
    f.write(svg)

cairosvg.svg2png(bytestring=svg.encode("utf-8"),
                 write_to="/home/user/gtm-agents/workspace/kt_diagram.png",
                 output_width=W, output_height=H)
print("done")
