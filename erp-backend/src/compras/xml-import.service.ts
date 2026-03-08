import { Injectable } from '@nestjs/common'
import { XMLParser } from 'fast-xml-parser'

@Injectable()
export class XmlService {

  parse(xml: string) {
    const parser = new XMLParser()
    return parser.parse(xml)
  }

}