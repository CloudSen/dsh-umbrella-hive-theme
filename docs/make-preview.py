"""Generates docs/preview.svg — the bundle detail image.

The storefront preview is the same art rasterized into assets/preview.png, because
the market refuses SVG screenshots:

    rsvg-convert -w 1280 -h 600 docs/preview.svg -o assets/preview.png

The geometry mirrors the client renderer (client.js): the same camera, the same
deck stack, the same shaft, the same rail tunnel. Keep the constants here in
step with HIVE in client.js when the model changes.
"""
import math

STAGE, BASE, FOCAL, CAM, PITCH, YAW = 200.0, 286.0, 404.0, 9.0, -0.22, 0.5
DECKS = [(0.92, 0.44), (1.25, 0.53), (1.58, 0.63), (1.91, 0.74),
         (2.24, 0.85), (2.57, 0.95), (2.9, 1.03), (3.23, 1.1)]
TOP_Y, SHAFT_TOP = 3.5, 5.95
SHAFT_BOTTOM_R, SHAFT_TOP_R = 0.155, 0.088
COLLARS = (3.72, 4.16, 4.6, 5.04, 5.48, 5.86)
RAIL_ANGLE, RAIL_LEN, RAIL_GRADE = -0.62, 1.72, 0.062

TOP = (242, 132, 144)
WALL = (176, 62, 74)
INNER = (96, 28, 38)
EDGE = 'rgba(255,120,140,0.34)'

cy, sy = math.cos(YAW), math.sin(YAW)
cp, sp = math.cos(PITCH), math.sin(PITCH)
LIGHT = (-0.42, 0.82, -0.42)
faces = []


def shade(nx, ny, nz):
    x1 = nx * cy - nz * sy
    z1 = nx * sy + nz * cy
    y1 = ny * cp - z1 * sp
    z2 = ny * sp + z1 * cp
    return 0.46 + 0.54 * max(0, x1 * LIGHT[0] + y1 * LIGHT[1] + z2 * LIGHT[2])


def project(x, y, z):
    x1 = x * cy - z * sy
    z1 = x * sy + z * cy
    y1 = y * cp - z1 * sp
    z2 = y * sp + z1 * cp
    s = FOCAL / (CAM + z2)
    return (STAGE + x1 * s, BASE - y1 * s, z2)


def poly(points, normal, base, stroke=None, lw=0.6, emissive=False, alpha=None):
    pr = [project(*q) for q in points]
    depth = sum(q[2] for q in pr) / len(pr)
    lit = 1 if emissive else shade(*normal)
    fog = min(1, max(0, 1 - (depth + 0.7) * 0.15))
    col = tuple(int(min(255, max(0, c * lit * fog))) for c in base)
    faces.append(('p', pr, depth, col, stroke, lw, alpha))


def line(points, stroke, lw, bias=0):
    pr = [project(*q) for q in points]
    depth = sum(q[2] for q in pr) / len(pr) + bias
    faces.append(('l', pr, depth, None, stroke, lw, None))


def hex_ring(r, y, offset=0.0):
    return [(math.cos(i / 6 * 2 * math.pi + offset) * r, y,
             math.sin(i / 6 * 2 * math.pi + offset) * r) for i in range(6)]


def shaft_radius(y):
    t = min(1, max(0, (y - TOP_Y) / (SHAFT_TOP - TOP_Y)))
    return SHAFT_BOTTOM_R + (SHAFT_TOP_R - SHAFT_BOTTOM_R) * t


def build():
    # Central mast.
    mr = 0.07
    for s in range(6):
        a0, a1 = s / 6 * 2 * math.pi, (s + 1) / 6 * 2 * math.pi
        poly([(math.cos(a0) * mr, 0.02, math.sin(a0) * mr),
              (math.cos(a1) * mr, 0.02, math.sin(a1) * mr),
              (math.cos(a1) * mr, SHAFT_TOP, math.sin(a1) * mr),
              (math.cos(a0) * mr, SHAFT_TOP, math.sin(a0) * mr)],
             [math.cos((a0 + a1) / 2), 0, math.sin((a0 + a1) / 2)],
             [182, 72, 84], 'rgba(255,140,158,0.22)', 0.5)

    # Bottom complex: halls, towers, corridors, huts, vents on a plinth.
    def block(bx):
        x0, x1 = bx['x'] - bx['w'] / 2, bx['x'] + bx['w'] / 2
        z0, z1 = bx['z'] - bx['d'] / 2, bx['z'] + bx['d'] / 2
        y0, y1 = bx['y'], bx['y'] + bx['h']
        poly([(x0, y1, z0), (x1, y1, z0), (x1, y1, z1), (x0, y1, z1)], [0, 1, 0], [182, 72, 84], EDGE)
        poly([(x0, y0, z0), (x1, y0, z0), (x1, y1, z0), (x0, y1, z0)], [0, 0, -1], [160, 54, 66], EDGE)
        poly([(x1, y0, z0), (x1, y0, z1), (x1, y1, z1), (x1, y1, z0)], [1, 0, 0], [128, 40, 50], EDGE)
        poly([(x0, y0, z1), (x1, y0, z1), (x1, y1, z1), (x0, y1, z1)], [0, 0, 1], [96, 28, 38], EDGE, 0.5)
        for band in bx.get('bands', [0.45]):
            height = min(bx['h'] * 0.17, 0.04)
            poly([(x0 + 0.03, y0 + bx['h'] * band, z0 - 0.001), (x1 - 0.03, y0 + bx['h'] * band, z0 - 0.001),
                  (x1 - 0.03, y0 + bx['h'] * band + height, z0 - 0.001),
                  (x0 + 0.03, y0 + bx['h'] * band + height, z0 - 0.001)],
                 [0, 0, -1], [255, 150, 160], None, 0.5, True)

    rad = 1.16
    for side in range(6):
        a0, a1 = side / 6 * 2 * math.pi, (side + 1) / 6 * 2 * math.pi
        mid = (a0 + a1) / 2
        poly([(math.cos(a0) * rad, 0.04, math.sin(a0) * rad), (math.cos(a1) * rad, 0.04, math.sin(a1) * rad),
              (math.cos(a1) * rad * 0.34, 0.04, math.sin(a1) * rad * 0.34),
              (math.cos(a0) * rad * 0.34, 0.04, math.sin(a0) * rad * 0.34)],
             [0, 1, 0], [176, 66, 78], 'rgba(255,150,166,0.32)')
        poly([(math.cos(a0) * rad, 0, math.sin(a0) * rad), (math.cos(a1) * rad, 0, math.sin(a1) * rad),
              (math.cos(a1) * rad, 0.04, math.sin(a1) * rad), (math.cos(a0) * rad, 0.04, math.sin(a0) * rad)],
             [math.cos(mid), 0, math.sin(mid)], [128, 40, 50], 'rgba(255,120,140,0.24)')

    for bx in [
        dict(y=0.14, x=-0.5, z=0.34, w=0.4, d=0.2, h=0.2, bands=[0.4, 0.72]),
        dict(y=0.1, x=0.44, z=-0.42, w=0.42, d=0.18, h=0.16),
        dict(y=0.2, x=0.14, z=0.6, w=0.26, d=0.24, h=0.28, bands=[0.3, 0.62]),
        dict(y=0.06, x=-0.75, z=-0.2, w=0.58, d=0.1, h=0.1),
        dict(y=0.05, x=0.74, z=0.2, w=0.19, d=0.17, h=0.44, bands=[0.24, 0.46, 0.68]),
        dict(y=0.05, x=-0.3, z=-0.63, w=0.25, d=0.19, h=0.36, bands=[0.28, 0.58, 0.84]),
        dict(y=0.05, x=0.5, z=0.64, w=0.16, d=0.15, h=0.27, bands=[0.3, 0.7]),
        dict(y=0.05, x=-0.86, z=0.42, w=0.17, d=0.16, h=0.23),
        dict(y=0.34, x=-0.5, z=0.34, w=0.24, d=0.14, h=0.11),
        dict(y=0.26, x=0.14, z=0.6, w=0.16, d=0.16, h=0.12),
        dict(y=0.41, x=-0.3, z=-0.63, w=0.14, d=0.12, h=0.1),
        dict(y=0.03, x=0.0, z=0.14, w=0.74, d=0.07, h=0.05),
        dict(y=0.03, x=-0.18, z=-0.22, w=0.07, d=0.78, h=0.05),
        dict(y=0.04, x=0.32, z=0.38, w=0.52, d=0.06, h=0.045),
        dict(y=0.04, x=0.52, z=-0.2, w=0.06, d=0.5, h=0.045),
    ]:
        block(bx)

    for hut in range(12):
        angle = hut / 12 * 2 * math.pi + 0.26
        radius = 0.94 + (hut % 3) * 0.07
        block(dict(y=0.02, x=math.cos(angle) * radius, z=math.sin(angle) * radius,
                   w=0.09 + (hut % 2) * 0.05, d=0.08 + (hut % 3) * 0.02,
                   h=0.05 + (hut % 3) * 0.035))

    for vx, vz in [(0.6, -0.12), (-0.62, 0.66), (0.04, -0.78), (-0.94, 0.06), (0.34, 0.86)]:
        top = 0.3 + (abs(vx) + abs(vz)) * 0.08
        block(dict(y=0.02, x=vx, z=vz, w=0.055, d=0.055, h=top))
        poly([(vx - 0.045, top + 0.015, vz - 0.045), (vx + 0.045, top + 0.015, vz - 0.045),
              (vx + 0.045, top + 0.015, vz + 0.045), (vx - 0.045, top + 0.015, vz + 0.045)],
             [0, 1, 0], [255, 176, 188], None, 0.5, True)

    # Decks.
    for y, r in DECKS:
        t = 0.2
        yt, yb, ri = y + t / 2, y - t / 2, r * 0.32
        for sec in range(12):
            a0, a1 = sec / 12 * 2 * math.pi, (sec + 1) / 12 * 2 * math.pi
            mid = (a0 + a1) / 2
            o0, o1 = (math.cos(a0) * r, math.sin(a0) * r), (math.cos(a1) * r, math.sin(a1) * r)
            i0, i1 = (math.cos(a0) * ri, math.sin(a0) * ri), (math.cos(a1) * ri, math.sin(a1) * ri)
            poly([(o0[0], yt, o0[1]), (o1[0], yt, o1[1]), (i1[0], yt, i1[1]), (i0[0], yt, i0[1])],
                 [0, 1, 0], TOP, 'rgba(255,150,166,0.24)')
            poly([(o0[0], yb, o0[1]), (o1[0], yb, o1[1]), (o1[0], yt, o1[1]), (o0[0], yt, o0[1])],
                 [math.cos(mid), 0, math.sin(mid)], WALL, EDGE)
            poly([(i0[0], yb, i0[1]), (i1[0], yb, i1[1]), (i1[0], yt, i1[1]), (i0[0], yt, i0[1])],
                 [-math.cos(mid), 0, -math.sin(mid)], INNER, 'rgba(255,90,110,0.16)', 0.5)
        line(hex_ring(r, yt + 0.002), 'rgba(255,190,205,0.55)', 0.8, -0.006)
    # Crown deck detail: mezzanine, catwalks, pods, railing, masts.
    cy_, cr_ = DECKS[-1]
    cyt = cy_ + 0.1
    mezz_in, mezz_out, mezz_h = 0.4, 0.66, 0.12
    mezz_y = cyt + mezz_h
    for sec in range(12):
        a0, a1 = sec / 12 * 2 * math.pi, (sec + 1) / 12 * 2 * math.pi
        mid = (a0 + a1) / 2
        o0 = (math.cos(a0) * mezz_out, math.sin(a0) * mezz_out)
        o1 = (math.cos(a1) * mezz_out, math.sin(a1) * mezz_out)
        i0 = (math.cos(a0) * mezz_in, math.sin(a0) * mezz_in)
        i1 = (math.cos(a1) * mezz_in, math.sin(a1) * mezz_in)
        poly([(o0[0], mezz_y, o0[1]), (o1[0], mezz_y, o1[1]), (i1[0], mezz_y, i1[1]), (i0[0], mezz_y, i0[1])],
             [0, 1, 0], [214, 100, 112], 'rgba(255,160,176,0.3)')
        poly([(o0[0], cyt, o0[1]), (o1[0], cyt, o1[1]), (o1[0], mezz_y, o1[1]), (o0[0], mezz_y, o0[1])],
             [math.cos(mid), 0, math.sin(mid)], [150, 52, 62], EDGE)
    line(hex_ring(mezz_out, mezz_y + 0.003), 'rgba(255,196,210,0.6)', 0.8, -0.006)

    for walk in range(6):
        ang = walk / 6 * 2 * math.pi + math.pi / 6
        dx, dz = math.cos(ang), math.sin(ang)
        sd = (-math.sin(ang), math.cos(ang))
        wy = cyt + 0.02
        quad = lambda rr, lat, hh: (dx * rr + sd[0] * lat, hh, dz * rr + sd[1] * lat)
        poly([quad(0.64, -0.045, wy), quad(1.06, -0.045, wy), quad(1.06, 0.045, wy), quad(0.64, 0.045, wy)],
             [0, 1, 0], [196, 84, 96], 'rgba(255,150,166,0.28)')
        poly([quad(0.66, -0.012, wy + 0.002), quad(1.04, -0.012, wy + 0.002),
              quad(1.04, 0.012, wy + 0.002), quad(0.66, 0.012, wy + 0.002)],
             [0, 1, 0], [255, 168, 182], None, 0.5, True)

    for pod in range(8):
        ang = pod / 8 * 2 * math.pi + 0.35
        size = 0.1 + (pod % 3) * 0.025
        block(dict(y=cyt, x=math.cos(ang) * 0.82, z=math.sin(ang) * 0.82,
                   w=size, d=size * 0.8, h=0.07 + (pod % 2) * 0.04, bands=[0.4, 0.7]))

    for post in range(24):
        ang = post / 24 * 2 * math.pi
        px, pz = math.cos(ang) * 1.085, math.sin(ang) * 1.085
        line([(px, cyt, pz), (px, cyt + 0.085, pz)], 'rgba(255,150,166,0.45)', 0.7, -0.004)
    line(hex_ring(1.085, cyt + 0.085), 'rgba(255,180,196,0.5)', 0.8, -0.005)

    for mast in range(4):
        ang = mast / 4 * 2 * math.pi + math.pi / 4
        mx, mz = math.cos(ang) * 0.94, math.sin(ang) * 0.94
        mast_h = 0.3 + (mast % 2) * 0.16
        block(dict(y=cyt, x=mx, z=mz, w=0.035, d=0.035, h=mast_h))
        poly([(mx - 0.03, cyt + mast_h + 0.012, mz - 0.03), (mx + 0.03, cyt + mast_h + 0.012, mz - 0.03),
              (mx + 0.03, cyt + mast_h + 0.012, mz + 0.03), (mx - 0.03, cyt + mast_h + 0.012, mz + 0.03)],
             [0, 1, 0], [255, 196, 208], None, 0.5, True)

    # Top cap.
    top_r, top_t = 0.5, 0.14
    for sec in range(12):
        a0, a1 = sec / 12 * 2 * math.pi, (sec + 1) / 12 * 2 * math.pi
        o0, o1 = (math.cos(a0) * top_r, math.sin(a0) * top_r), (math.cos(a1) * top_r, math.sin(a1) * top_r)
        i0, i1 = (math.cos(a0) * 0.12, math.sin(a0) * 0.12), (math.cos(a1) * 0.12, math.sin(a1) * 0.12)
        poly([(o0[0], TOP_Y + top_t / 2, o0[1]), (o1[0], TOP_Y + top_t / 2, o1[1]),
              (i1[0], TOP_Y + top_t / 2, i1[1]), (i0[0], TOP_Y + top_t / 2, i0[1])],
             [0, 1, 0], TOP, 'rgba(255,150,166,0.26)')
        poly([(o0[0], TOP_Y - top_t / 2, o0[1]), (o1[0], TOP_Y - top_t / 2, o1[1]),
              (o1[0], TOP_Y + top_t / 2, o1[1]), (o0[0], TOP_Y + top_t / 2, o0[1])],
             [math.cos((a0 + a1) / 2), 0, math.sin((a0 + a1) / 2)], WALL, EDGE)

    # Shaft to the surface.
    for s in range(6):
        a0, a1 = s / 6 * 2 * math.pi, (s + 1) / 6 * 2 * math.pi
        poly([(math.cos(a0) * SHAFT_BOTTOM_R, TOP_Y, math.sin(a0) * SHAFT_BOTTOM_R),
              (math.cos(a1) * SHAFT_BOTTOM_R, TOP_Y, math.sin(a1) * SHAFT_BOTTOM_R),
              (math.cos(a1) * SHAFT_TOP_R, SHAFT_TOP, math.sin(a1) * SHAFT_TOP_R),
              (math.cos(a0) * SHAFT_TOP_R, SHAFT_TOP, math.sin(a0) * SHAFT_TOP_R)],
             [math.cos((a0 + a1) / 2), 0, math.sin((a0 + a1) / 2)], [182, 72, 84], 'rgba(255,140,158,0.3)')

    for collar_y in COLLARS:
        local_r, collar_r, collar_t = shaft_radius(collar_y), shaft_radius(collar_y) + 0.048, 0.07
        for s in range(6):
            a0, a1 = s / 6 * 2 * math.pi, (s + 1) / 6 * 2 * math.pi
            poly([(math.cos(a0) * collar_r, collar_y, math.sin(a0) * collar_r),
                  (math.cos(a1) * collar_r, collar_y, math.sin(a1) * collar_r),
                  (math.cos(a1) * collar_r, collar_y + collar_t, math.sin(a1) * collar_r),
                  (math.cos(a0) * collar_r, collar_y + collar_t, math.sin(a0) * collar_r)],
                 [math.cos((a0 + a1) / 2), 0, math.sin((a0 + a1) / 2)], WALL, EDGE)
            poly([(math.cos(a0) * collar_r, collar_y + collar_t, math.sin(a0) * collar_r),
                  (math.cos(a1) * collar_r, collar_y + collar_t, math.sin(a1) * collar_r),
                  (math.cos(a1) * local_r, collar_y + collar_t, math.sin(a1) * local_r),
                  (math.cos(a0) * local_r, collar_y + collar_t, math.sin(a0) * local_r)],
                 [0, 1, 0], TOP, 'rgba(255,150,166,0.3)')
        line(hex_ring(collar_r, collar_y + 0.073), 'rgba(255,190,205,0.55)', 0.6, -0.004)

    for opening_y, opening_a in ((3.7, 0.5), (4.4, 2.5), (5.2, 4.4)):
        local_r = shaft_radius(opening_y) + 0.002
        w0, w1 = opening_a - 0.21, opening_a + 0.21
        poly([(math.cos(w0) * local_r, opening_y, math.sin(w0) * local_r),
              (math.cos(w1) * local_r, opening_y, math.sin(w1) * local_r),
              (math.cos(w1) * local_r, opening_y + 0.14, math.sin(w1) * local_r),
              (math.cos(w0) * local_r, opening_y + 0.14, math.sin(w0) * local_r)],
             [math.cos(opening_a), 0, math.sin(opening_a)], [255, 150, 162], None, 0.5, True)

    hatch_y, hatch_r = SHAFT_TOP + 0.12, SHAFT_TOP_R + 0.1
    for s in range(6):
        a0, a1 = s / 6 * 2 * math.pi, (s + 1) / 6 * 2 * math.pi
        poly([(math.cos(a0) * hatch_r, SHAFT_TOP, math.sin(a0) * hatch_r),
              (math.cos(a1) * hatch_r, SHAFT_TOP, math.sin(a1) * hatch_r),
              (math.cos(a1) * hatch_r, hatch_y, math.sin(a1) * hatch_r),
              (math.cos(a0) * hatch_r, hatch_y, math.sin(a0) * hatch_r)],
             [math.cos((a0 + a1) / 2), 0, math.sin((a0 + a1) / 2)], WALL, EDGE)
    poly(hex_ring(hatch_r, hatch_y), [0, 1, 0], [255, 214, 222], 'rgba(255,220,230,0.7)', 0.5, True)

    build_tunnel()


def build_tunnel():
    """The terminus at the base and the long bore leaving it.

    Mirrors the client: level at the station, height growing with t squared,
    narrow cross-section, no rails drawn (they were sub-pixel and only caused
    sorting artifacts at this size).
    """
    angle = -0.5
    hb, bh = 0.052, 0.072
    length, rise = 6.8, 1.45
    start = (math.cos(angle) * 1.04, 0.045, math.sin(angle) * 1.04)
    d = (math.cos(angle), 0.0, math.sin(angle))
    side = (-math.sin(angle), 0.0, math.cos(angle))

    def rp(t, lateral, height):
        return (start[0] + d[0] * length * t + side[0] * lateral,
                start[1] + rise * t * t + height,
                start[2] + d[2] * length * t + side[2] * lateral)

    seg = 12
    for k in range(seg):
        t0, t1 = k / seg, (k + 1) / seg
        poly([rp(t0, -hb, 0), rp(t0, hb, 0), rp(t1, hb, 0), rp(t1, -hb, 0)],
             [0, 1, 0], [132, 42, 52], 'rgba(255,120,140,0.2)', 0.4)
        poly([rp(t0, -hb, bh), rp(t0, hb, bh), rp(t1, hb, bh), rp(t1, -hb, bh)],
             [0, 1, 0], [198, 88, 100])
        for s in (-1, 1):
            poly([rp(t0, s * hb, 0), rp(t1, s * hb, 0), rp(t1, s * hb, bh), rp(t0, s * hb, bh)],
                 [side[0] * s, 0, side[2] * s], [150, 50, 62], 'rgba(255,120,140,0.18)', 0.4)

    for t in (0.1, 0.32, 0.54, 0.76, 0.95):
        for s in (-1, 1):
            line([rp(t, s * (hb + 0.006), 0), rp(t, s * (hb + 0.006), bh + 0.01)],
                 'rgba(255,170,186,0.3)', 0.6, -0.005)
        line([rp(t, -hb - 0.006, bh + 0.01), rp(t, hb + 0.006, bh + 0.01)],
             'rgba(255,170,186,0.3)', 0.6, -0.005)

    for s in (-1, 1):
        line([rp(0.004, s * (hb + 0.01), 0), rp(0.004, s * (hb + 0.01), bh + 0.018)],
             'rgba(255,214,224,0.55)', 0.8, -0.005)
    line([rp(0.004, -hb - 0.01, bh + 0.018), rp(0.004, hb + 0.01, bh + 0.018)],
         'rgba(255,214,224,0.55)', 0.8, -0.005)

    # Platform, canopy.
    poly([rp(-0.035, -0.1, 0.004), rp(0.01, -0.09, 0.004), rp(0.01, 0.09, 0.004),
          rp(-0.035, 0.1, 0.004)], [0, 1, 0], [204, 96, 108], 'rgba(255,170,186,0.32)', 0.5)
    line([rp(-0.032, -0.095, 0.006), rp(-0.032, 0.095, 0.006)], 'rgba(255,206,218,0.45)', 0.8, -0.006)
    poly([rp(-0.045, -0.1, 0.115), rp(0.02, -0.1, 0.115), rp(0.02, 0.1, 0.115),
          rp(-0.045, 0.1, 0.115)], [0, 1, 0], [180, 72, 84], 'rgba(255,160,176,0.3)', 0.5)
    for s in (-1, 1):
        line([rp(-0.04, s * 0.085, 0.004), rp(-0.04, s * 0.085, 0.115)],
             'rgba(255,160,176,0.4)', 0.7, -0.004)


def render():
    build()
    faces.sort(key=lambda f: -f[2])
    out = []
    for kind, pts, _depth, col, stroke, lw, alpha in faces:
        coords = ' '.join(f'{x:.1f},{y:.1f}' for x, y, _ in pts)
        if kind == 'p':
            fill = f'rgba({col[0]},{col[1]},{col[2]},{alpha})' if alpha is not None \
                else f'rgb({col[0]},{col[1]},{col[2]})'
            st = f' stroke="{stroke}" stroke-width="{lw}"' if stroke else ''
            out.append(f'<polygon points="{coords}" fill="{fill}"{st}/>')
        else:
            out.append(f'<polyline points="{coords}" fill="none" stroke="{stroke}" stroke-width="{lw}"/>')

    walls = ''
    for cx, cy0 in ((490, 120), (560, 152), (490, 206), (560, 244), (620, 110), (620, 192)):
        pts = ' '.join(
            f'{cx + 32 * math.cos(-math.pi / 2 + i * math.pi / 3):.1f},'
            f'{cy0 + 32 * math.sin(-math.pi / 2 + i * math.pi / 3):.1f}' for i in range(6))
        walls += f'<polygon points="{pts}" fill="none" stroke="#E8112D" stroke-opacity="0.11" stroke-width="1"/>'

    pads = ''.join(
        f'<ellipse cx="{STAGE}" cy="{BASE}" rx="{68 * (1 + i * 0.22):.0f}" '
        f'ry="{12 * (1 + i * 0.22):.0f}" fill="none" stroke="#FF4055" '
        f'stroke-opacity="{0.36 - i * 0.09:.2f}" stroke-width="1"/>' for i in range(3))
    swatches = ''.join(
        f'<rect x="{x}" y="264" width="22" height="12" rx="3" fill="{c}"/>'
        for x, c in ((456, '#E8112D'), (484, '#FF4055'), (512, '#C8AEB4'),
                     (540, '#241014'), (568, '#060107')))

    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="640" height="300" viewBox="0 0 640 300" role="img">
  <title>The Hive theme</title>
  <defs>
    <radialGradient id="room" cx="30%" cy="60%" r="68%"><stop offset="0" stop-color="#5A0917" stop-opacity="0.5"/><stop offset="0.62" stop-color="#2A0410" stop-opacity="0.15"/><stop offset="1" stop-color="#060107" stop-opacity="0"/></radialGradient>
    <radialGradient id="padg" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#FF3048" stop-opacity="0.3"/><stop offset="1" stop-color="#FF3048" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="640" height="300" rx="18" fill="#060107"/>
  <rect width="640" height="300" rx="18" fill="url(#room)"/>
  {walls}
  <ellipse cx="{STAGE}" cy="{BASE}" rx="76" ry="14" fill="url(#padg)"/>
  <g transform="translate(34 50) scale(0.83)">
  {''.join(out)}
  </g>
  {pads}
  {swatches}
  <rect x="0.6" y="0.6" width="638.8" height="298.8" rx="17.4" fill="none" stroke="#E8112D" stroke-opacity="0.26"/>
  <g stroke="#FF4055" stroke-opacity="0.5" stroke-width="1.6" stroke-linecap="round"><path d="M18 34 V18 H34"/><path d="M606 18 H622 V34"/><path d="M622 266 V282 H606"/><path d="M34 282 H18 V266"/></g>
</svg>'''


if __name__ == '__main__':
    svg = render()
    with open('docs/preview.svg', 'w') as handle:
        handle.write(svg)
    print('bytes', len(svg))