#!/usr/bin/env python3
"""Build the optional, redrawn DotA1-inspired characters from editable paths.

geometry.py owns the DotA1 geometry and palette treatment. Most heroes use
new paths; Kael, Luna and Terrorblade deliberately reuse the richer ordinary
pose geometry as a base, then recolor and outline it in geometry.py so their
faces, robe layers, saddle contact and tattooed anatomy remain readable. Ordinary
frames are never edited, and no third-party image/model/texture is downloaded
or embedded.
"""
from __future__ import annotations
import argparse
import hashlib
import json
from pathlib import Path
import xml.etree.ElementTree as ET

from geometry import NS, character

HERE = Path(__file__).resolve().parent
REPO = HERE.parents[4]
BASE = REPO / 'game/static/dotarogue/assets/characters'
HEROES = ('rover','bulwark','conductor','scavenger','jugg','sf','kael','luna','tb')
POSES = ('idle-a','idle-alt','walk-a','walk-b','dash','attack-windup','attack','attack-release','skill')
ET.register_namespace('',NS)


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def public_path(path):
    return path.relative_to(REPO).as_posix() if path.is_relative_to(REPO) else path.name


def redraw(source, target, hero, side, pose, demon=False):
    source_root = ET.parse(source).getroot()
    attrs = {key:source_root.get(key) for key in ('width','height','viewBox')}
    attrs.update({'fill':'none','stroke-linejoin':'round','stroke-linecap':'round'})
    dimensions = ' '.join(f'{key}="{value}"' for key,value in attrs.items())
    title = f'{hero} · DotA1-inspired redrawn {"demon " if demon else ""}{"side" if side else "front"} · {pose}'
    description = 'Project-drawn classic hero skin. Six heroes use reconstructed silhouettes; Kael, Luna and Terrorblade retain refined ordinary pose geometry and equipment. Ordinary canvas, transforms and foot anchor retained. No official model, texture, image, script or embedded animation.'
    svg = f'<svg xmlns="{NS}" {dimensions}><title>{title}</title><desc>{description}</desc>'+character(source_root,hero,side,pose,demon)+'</svg>\n'
    # Parsing before writing catches path-source serialization errors.
    ET.fromstring(svg)
    target.parent.mkdir(parents=True,exist_ok=True)
    target.write_text(svg,encoding='utf-8')


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output-root',type=Path,default=BASE/'dota1')
    parser.add_argument('--manifest',type=Path,default=HERE/'manifest.json')
    parser.add_argument('--source-root',type=Path,default=HERE/'art/source',help='Twenty layered idle source SVGs, independently editable from runtime frames.')
    args=parser.parse_args()
    output=args.output_root.resolve();source_root=args.source_root.resolve();entries=[];sources=[]
    for hero in HEROES:
        for demon in ([False,True] if hero=='tb' else [False]):
            for side in [False,True]:
                prefix=hero+('-demon' if demon else '')+('-side' if side else '')
                for pose in POSES:
                    source=BASE/hero/(prefix+'-'+pose+'.svg')
                    target=output/hero/source.name
                    redraw(source,target,hero,side,pose,demon)
                    entries.append({'hero':hero,'source':public_path(source),'path':public_path(target),'sourceSha256':sha(source),'sha256':sha(target)})
                    if pose=='idle-a':
                        editable=source_root/(prefix+('-source.svg'))
                        editable.parent.mkdir(parents=True,exist_ok=True)
                        editable.write_bytes(target.read_bytes())
                        sources.append({'hero':hero,'view':'side' if side else 'front','demon':demon,'path':public_path(editable),'sha256':sha(editable)})
        if hero=='luna':
            source=BASE/hero/'luna-glaive.svg';target=output/hero/source.name
            redraw(source,target,hero,False,'glaive')
            entries.append({'hero':hero,'source':public_path(source),'path':public_path(target),'sourceSha256':sha(source),'sha256':sha(target)})
    manifest={'schemaVersion':2,'kind':'project-drawn SVG geometry reconstruction','count':len(entries),'editableSourceCount':len(sources),
      'geometry':'Rover, Bristleback, Zeus, Alchemist, Juggernaut and Shadow Fiend use new editable paths in geometry.py. Kael, Luna and both Terrorblade forms reuse the richer ordinary pose geometry as a base, with classic palette and outline treatment in geometry.py. Twenty layered source SVGs expose the generated idle anatomy and equipment; ordinary frames remain read-only inputs.',
      'rights':'New project-drawn paths visually reference classic Warcraft III / DotA1 units. No official model, texture, animation or reference image is included in the SVGs.',
      'generatorInputs':[{'path':public_path(HERE/name),'sha256':sha(HERE/name)} for name in ('build_skin.py','geometry.py')],
      'editableSources':sources,'files':entries}
    args.manifest.parent.mkdir(parents=True,exist_ok=True)
    args.manifest.write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(f'Generated {len(entries)} runtime SVGs and {len(sources)} layered source SVGs.')


if __name__=='__main__':
    main()
